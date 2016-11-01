#!/usr/bin/env python3

from flask import Flask, render_template, jsonify, request
import sys
import logging
from decimal import Decimal
import braintree

PRICES = {
	"USD": {
		"price": 29,
		"display_price": "$29",
	},
	"EUR": {
		"price": 29,
		"display_price": "29€"
	}
}

PASSWORD_MIN_LENGTH = 6
PASSWORD_MAX_LENGTH = 30

app = Flask(__name__)
log = logging.getLogger('werkzeug')


def err(message, code=None):
	return jsonify({
		"status": "ERROR",
		"code": code if code else "CheckoutController.cardProcessingError",
		"body": message
	})


@app.route('/')
def home():
	return render_template('home.html')

@app.route('/confirm-modal')
def confirm_modal():
	return render_template('partials/confirm-modal.html')


@app.route('/checkout')
def checkout_form():
	return render_template('checkout.html', displayPrice=PRICES['USD']['display_price'],
												 passwordMinLength=PASSWORD_MIN_LENGTH, passwordMaxLength=PASSWORD_MAX_LENGTH)


@app.route('/success')
def success():
	return render_template('success.html')


@app.route('/api/price/<option>')
def get_price(option=None):
	return jsonify({
		"status": "OK",
		"code": "ok",
		"return_key": None,
		"body": PRICES['USD']
	})


@app.route('/doCheckout', methods=['POST', ])
def do_checkout():
	currency = 'USD'
	quoted_price = Decimal(request.form.get('price'))
	card_nonce = request.form.get('cardNonce')

	result = braintree.Transaction.sale({
		"amount": '{:.2f}'.format(quoted_price),
		"payment_method_nonce": card_nonce
	})
	transaction = result.transaction
	if not result.is_success:
		transaction_id = None
		if not transaction:
			errors = list()
			for error in result.errors.deep_errors:
				errors.append("{}: [{}] {}".format(error.attribute, error.code, error.message))
			error_string = "\n".join(errors)
			log.warn("Validation error(s) processing card: %s", error_string)
		else:
			transaction_id = transaction.id
			log.warn("Transaction failed: %s", result.message)
		return err(transaction_id, "CheckoutController.cardProcessingError")
	transaction_id = transaction.id
	if "paypal_account" == transaction.payment_instrument_type:
		payment_method = "PayPal"
	else:
		payment_method = "{} *{}".format(transaction.credit_card_details.card_type, transaction.credit_card_details.last_4)
	amount_charged = transaction.amount,
	amount_charged = amount_charged[0]
	log.info("Transaction %s processed %s / AVS %s / CVV %s / %s %s / response [%s] %s",
					 transaction_id,
					 payment_method,
					 transaction.avs_postal_code_response_code,
					 transaction.cvv_response_code,
					 transaction.currency_iso_code,
					 amount_charged.to_eng_string(),
					 transaction.processor_response_code,
					 transaction.processor_response_text
					 )
	return jsonify({
		"status": "OK",
		"code": "CheckoutController.purchaseSuccess",
		"return_key": None,
		"arguments": [transaction_id, amount_charged.to_eng_string(), currency]
	})


@app.errorhandler(Exception)
def handle_error(exc):
	log.error("Unhandled error", exc_info=sys.exc_info())
	return err(repr(exc), "CheckoutController.serverError")


app.register_error_handler(400, lambda e: 'bad request!')

if __name__ == '__main__':
	app.config.from_pyfile('checkout.cfg')
	braintree.Configuration.configure(braintree.Environment.Sandbox, merchant_id=app.config['MERCHANT_ID'],
																		public_key=app.config['PUBLIC_KEY'], private_key=app.config['PRIVATE_KEY'])
	app.run(host='0.0.0.0', debug=True)
