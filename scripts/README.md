# Setup

```bash
gcloud beta auth application-default login
# Set the GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS environment variables.
export GCLOUD_PROJECT=coral-firefly-151914
export GOOGLE_APPLICATION_CREDENTIALS=$HOME/.config/gcloud/application_default_credentials.json
yarn install
```
# Run

```bash
# Please note this command takes a while to execute (up to several mins!)
npm start
```
