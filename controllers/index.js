const LinkSchema = require('../models/link');
const checkValidUrl = require('check-valid-url');

const alphabets = '123456789abcdfghjkmnpqrstvwxyzABCDFGHJKLMNPQRSTVWXYZ-_',
    base = alphabets.length;

/**
 * Saves the link to the database and returns a shortened one
 *
 * @param req URL to save and shorten
 * @param res Shortened URL and other resource information
 */
const saveUrl = (req, res) => {
    if(req.body.url && isURL(req.body.url)){
        // LinkSchema.findOneAndUpdate(
        //     {"url": req.body.url},
        //     { $set: { "url": req.body.url,  timestamps: true}},
        //     { upsert: true, new: true, returnNewDocument: true},
        //     (err, url) => {
        //         if (err) {
        //             res.status(500).json({ message: 'Internal Server Error', error: err });
        //         } else {
        //             res.status(201).json({
        //                 code: url._id,
        //                 link: req.protocol + '://' + req.get('host') + '/' + url._id
        //             });
        //         }
        //     }
        // )

        
        const link = new LinkSchema(req.body);
        LinkSchema.find({"url":req.body.url}).limit(1).then((url) => {
            if(url.length == 0){
                link.save((err, doc) => {
                    if(err) {
                        return res.status(500).json({ message: 'Internal Server Error', error: err });
                    }
                    if(doc) {
                        const code = encode(doc._id);
                        res.status(201).json({
                            code: code,
                            short_url: req.protocol + '://' + req.get('host') + '/' + code,
                            long_url: url[0].url
                        });
                    }
                });
            }
            else {
                LinkSchema.findOneAndUpdate({"url":req.body.url}, {
                    updatedAt: new Date()
                }, (err, doc) => {
                    if (err) {
                        res.status(500).json({ message: 'Internal Server Error', error: err });
                    }
                });
                const code = encode(url[0]._id);
                res.status(201).json({
                    code: code,
                    short_url: req.protocol + '://' + req.get('host') + '/' + code,
                    long_url: url[0].url
                });
            }
        }, (err) => {
             res.status(500).json({ message: 'Internal Server Error', error: err });
        });
    } else {
        res.status(400).json({ message: 'Bad request: url is undefined or not formatted properly'});
    }
};

/**
 * Takes the code, decodes it, and searches
 * the database for the record to redirect user
 *
 * @param req link code as request parameter
 * @param res URL
 */
const getUrl = (req, res) => {
    if(req.params.code){
        const id = decode(req.params.code);

        // todo extend with query params to include other metadata
        const projection =
            { _id: false, url: true }; // only return URL in payload

        LinkSchema.findById(id, projection, (err, link) => {
           if(err) {
               return res.status(500).json({ message: 'Internal Server Error', error: err });
           }

           if(link === null) return res.status(404).json({ message: 'Resource Not Found' });
            res.redirect(link.url);
            res.end();
        });
    }
};

/**
 * Taken from
 * https://github.com/delight-im/ShortURL/blob/master/JavaScript/ShortURL.js
 *
 * @param num
 * @returns returns shortened code that maps to the database
 */
const encode = (num) => {
    let code = '';
    while (num > 0) {
        code = alphabets.charAt(num % base) + code;
        num = Math.floor(num / base);
    }
    return code;
};

/**
 * Taken from
 * https://github.com/delight-im/ShortURL/blob/master/JavaScript/ShortURL.js
 *
 * @param code
 * @returns ID in database
 */
const decode = (code) => {
    let num = 0;
    for (let i = 0; i < code.length; i++) {
        num = num * base + alphabets.indexOf(code.charAt(i));
    }
    return num;
};

const isURL = (url) => {
    var urlRg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,20}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;
    return url.match(urlRg);
}

module.exports = {
    saveUrl,
    getUrl
};