//Dependencies
const request = require('request')

//Params
let workplace_access_token = null
const workplace_graph_url = "https://graph.workplace.com/"
const workplace_messaging_url = ""

//Workplace core http methods
function get(id, qs) {
    return new Promise(
        (resolve, reject) => {
            request.get(
                workplace_graph_url + id + (qs? "/?" + qs.map(e => e.k + "=" + e.v.join(',')).join('&') : ""), {
                headers: {
                    'User-Agent': 'workplace-node-sdk',
                    'Authorization': 'Bearer ' + workplace_access_token
                }
            }, 
            (err, res, body) => {
                if (err) return reject(err);
                try {
                    //JSON.parse() can throw an exception if not valid JSON
                    resolve(JSON.parse(body));
                } catch(e) {
                    reject(e);
                }
            });
        });
}

function post() {

}

module.exports = {

    setAccessToken: function (token) {
        workplace_access_token = token;
        return this;
    },
    get: {
        post: function(id) {
            return get(id)
        },

        likes: function(id) {}
    },
    create: {

    },
    update: {

    },
    delete: {

    },
    send: {
        msg: function(userid, text) {}
    }

}