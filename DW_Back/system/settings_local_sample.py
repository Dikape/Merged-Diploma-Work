# Individual settings. Configure it on project start up.
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SITE_ID = 1
SITE_URL = ''
SECRET_KEY = 'rjb93!#cwzyym#crz0+w@f_kb$rpya-!^x9z2+%6x8)1uo73o%'  # change the secret key for your local system.

# Debug mode options
DEBUG = True

# SECURITY WARNING: don't run with debug turned on in production!
if (DEBUG):
    ALLOWED_HOSTS = ['127.0.0.1']
    INTERNAL_IPS = ['127.0.0.1']
else:
    ALLOWED_HOSTS = ['*']
    INTERNAL_IPS = ['*']

# PostgeSQL definations:
# As a DB connector (driver) we recommend using psycopg2
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'deputies',  # Database name
        'USER': 'postgres',  # Postgres user name
        'PASSWORD': '',  # Postgres user password
        'HOST': 'localhost',
        'PORT': 5432
    }
}

# Static folder definations:
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR)
STATICFILES_DIRS = [os.path.join(STATIC_ROOT, 'static'), ]

# DON'T redifine fixtures path, please. it is important for fixtures upload.
FIXTURE_DIRS = [os.path.join(BASE_DIR, 'development/dumps')]

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': STATIC_ROOT + STATIC_URL + 'django_cache',
    }
}


