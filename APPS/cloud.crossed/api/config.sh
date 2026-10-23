sudo yum update -y
sudo yum install -y httpd24 php70 mysql56-server php70-mysqlnd
sudo chkconfig httpd on
chkconfig --list httpd
sudo usermod -a -G apache ec2-user
# exit
groups
sudo chown -R ec2-user:apache /var/www
sudo chmod 2775 /var/www
find /var/www -type d -exec sudo chmod 2775 {} \;
find /var/www -type f -exec sudo chmod 0664 {} \;
# echo "<?php phpinfo(); ?>" > /var/www/html/phpinfo.php
sudo yum list installed httpd24 php70 mysql56-server php70-mysqlnd
# rm /var/www/html/phpinfo.php
sudo service mysqld start
sudo mysql_secure_installation
sudo service mysqld stop
sudo chkconfig mysqld on
sudo yum install php70-mbstring.x86_64 php70-zip.x86_64 -y
cd /var/www/html
wget https://www.phpmyadmin.net/downloads/phpMyAdmin-latest-all-languages.tar.gz
tar -xvzf phpMyAdmin-latest-all-languages.tar.gz
mv phpMyAdmin-*-all-languages phpMyAdmin
sudo service mysqld start