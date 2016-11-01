Vagrant.configure('2') do |config|
  config.vm.box = 'minimal/jessie64'
  config.vm.hostname = 'checkout'
  config.vm.provision :shell, path: 'vm-setup.sh'
  config.vm.network :forwarded_port, guest: 5000, host: 5454
  config.vm.provider 'virtualbox' do |vb|
    vb.name = 'omgyes-checkout'
    vb.cpus = '1'
    vb.memory = '512'
    vb.customize ['modifyvm', :id, '--natdnshostresolver1', 'on']
    vb.customize ['guestproperty', 'set', :id, '/VirtualBox/GuestAdd/VBoxService/--timesync-set-threshold', 10000]
    vb.customize ['modifyvm', :id, '--usb', 'off']
    vb.customize ['modifyvm', :id, '--usbehci', 'off']
  end
end
