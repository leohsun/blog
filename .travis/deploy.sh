cp ./travis/id_rsa ~/.ssh
ls ~/.ssh
chmod 600 ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa
ssh root@www.topdiantop.top
cd /home/
ls