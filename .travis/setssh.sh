set -x
openssl aes-256-cbc -K $encrypted_de20df944f06_key -iv $encrypted_de20df944f06_iv
  -in .travis/id_rsa.enc -out .travis/id_rsa -d
eval "$(ssh-agent -s)"
cp .travis/id_rsa ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa