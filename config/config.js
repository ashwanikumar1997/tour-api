module.exports = function () {
    return {
        app: {
            env: process.env.APP_ENV || 'dev',
            key: process.env.APP_KEY,
            url: process.env.SITE_URL,
            basePath: process.env.API_BASE_PATH || '',
            port: process.env.PORT || 8081
        },
        maxFeedsToCache: 5,
        mongoDb: {
            uri: process.env.MONGO_URI || 'mongodb://localhost:27017/tourdb'
            // host: process.env.MONGO_HOST || 'localhost',
            // port: process.env.MONGO_PORT || 27017,
            // db: process.env.MONGO_DB || 'envyd'
        },
        redis: {
            host: process.env.REDIS_HOST || 'localhost',
            password: process.env.REDIS_PASSWORD,
            port: process.env.REDIS_PORT || '6379'
        },
        facebook: {
            appId: process.env.FACEBOOK_APP_ID,
            appSecret: process.env.FACEBOOK_APP_SECRET
        },
        /* firebase: {
             apiUrl: 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=$apiKey',
             apiKey: process.env.FIREBASE_API_KEY,
             iosBundleId: 'com.findyourenvy.envy',
             dynamicLinkDomain: process.env.FIREBASE_DYNAMIC_LINK_DOMAIN || 'n8jnv.app.goo.gl',
             iosAppStoreId: '1210759406',
             iosCustomScheme: 'envy',
             iosFallbackLink: process.env.FIREBASE_IOS_FALLBACK_LINK || 'http://findyourenvy.com/download'
         },*/
        fileUploadEndpoint: process.env.FILE_UPLOAD_ENDPOINT,
        uploadPaths: {
            places: __dirname + '/../uploads/places',
            tours: __dirname + '/../uploads/tours'
        },
        // facebookAuth: {
        //     'clientID': 'Envy', // App Id
        //     'clientSecret': 'your-client-secret-here', // App Secret
        //     'callbackURL': 'http://localhost:8080/auth/facebook/callback'
        // },
        routesFile: __dirname + '/../app/routes',
        postImageVariations: {
            thumbnail: {
                width: 100,
                height: 100
            }
        },
        accounts: {
            displayName: {
                minLength: process.env.DISPLAY_NAME_LENGTH || 2,
            },
            password: {
                minLength: process.env.PASSWORD_LENGTH || 6,
                maxAttempts: process.env.PASSWORD_ATTEMPTS || 10,
                lockoutLength: process.env.PASSWORD_LOCKOUT || (60 * 5), // 5 minutes
                resetMaxAge: process.env.PASSWORD_RESET_START || (60 * 5), // how long (seconds) to enter password reset code
            },
            //mediaTargetLocation: 'aws'
            mediaTargetLocation: 'uploads'
        },
        /* categories: {
             defaultFolderMedia: {
                 storageEngine: 'aws',
                 path: '/categories/default-20170101.jpg'
             },
             myPostsFolderMedia: {
                 storageEngine: 'aws',
                 path: '/categories/myposts-20170101.jpg'
             },
             allFolderMedia: {
                 storageEngine: 'aws',
                 path: '/categories/myenvy-20170101.jpg'
             },
             envyFolderMedia: {
                 storageEngine: 'aws',
                 path: '/categories/envyboxes-20170101.jpg'
             }
         },*/
        /*posts: {
            sharing: {
                // url: process.env.SITE_URL
                url: process.env.DOWNLOAD_APP_URL || 'https://envy.social/download'
            },
            saveFolders: {
                defaultName: 'General'
            },
            mediaTargetLocation: 'aws'
        },*/
        /* mediaLocations: {
             static: {
                 webUrl: process.env.SITE_URL + '/assets'
             },
             uploads: {
                 webUrl: process.env.URL_PUBLIC_UPLOADS || '/uploads',
                 systemPath: __dirname + '/../uploads'
             },
            /* aws: {
                 webUrl: process.env.AWS_WEB_URL || 'http://media.findyourenvy.com',
                 systemPath: '',
                 pkgcloud: {
                     client: {
                         provider: 'amazon',
                         keyId: process.env.AWS_ACCESS_KEY,
                         key: process.env.AWS_SECRET
                     },
                     container: process.env.AWS_MEDIA_CONTAINER || 'media.findyourenvy.com',
                     upload: {
                         acl: 'public-read'
                     }
                 },
             }*/
        /*},*/
        feedSearch: {
            categories: {
                minChars: 1,
                weight: 1, // not implemented
            },
            places: {
                minChars: 3,
                weight: 1, // not implemented
            },
            users: {
                minChars: 3,
                weight: 1, // not implemented
            }
        },
        mobile: {
            feeds: {
                mine: {
                    fallbackToGeneral: (process.env.FEEDS_MINE_FALLBACK && process.env.FEEDS_MINE_FALLBACK.toUpperCase() == 'TRUE') || false
                }
            }
        },
        localese: {
            providerName: 'Localese', // Do not change
            api: {
                endpoint: process.env.LOCALESE_API_ENDPOINT || 'https://api.neustarlocaleze.biz/v1',
                username: process.env.LOCALESE_API_USERNAME,
                password: process.env.LOCALESE_API_PASSWORD
            },
        },
        /*mailchimp: {
              apiKey: '7ace0e73c7cf28588b6ef58417e29de1-us14',
              lists: {
                  accountCreated: '8fa3ff7794'
              }
          },*/
        mailgun: {
            apiKey: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN
        },
        /* google: {
             places: {
                 apiKey: process.env.GOOGLE_PLACES_API_KEY || ''
             }
         }*/
    };
}
