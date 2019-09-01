//Dependencies
const request = require('request')

//Params
let workplace_access_token = null
const workplace_graph_url = "https://graph.workplace.com/"
const workplace_messaging_url = ""
const sdk_v = "0.0.1"

//Merge function for pagination results
Object.prototype.pagemerge = function(obj) {
    for (var i in obj) {
        if (i in this &&
            Array.isArray(obj[i]) && 
            Array.isArray(this[i])) {
                this[i].concat(obj[i]);
            }
        else {
            this[i] = obj[i]
        }
    }
 };

//Workplace core http methods
function get(id, edge, qs) {
    return new Promise(
        (resolve, reject) => {
            request.get(
                workplace_graph_url + (id? id + "/" : "") + (edge? edge + "/" : "") + (qs? "/?" + qs.map(e => e.k + "=" + e.v.join(',')).join('&') : ""), {
                headers: {
                    'User-Agent': 'workplace-node-sdk/'+sdk_v,
                    'Authorization': 'Bearer '+workplace_access_token
                }
            }, 
            (err, res, body) => {
                if (err) reject(err);
                try {
                    //JSON.parse() can throw an exception if not valid JSON
                    resolve(JSON.parse(body));
                } catch(e) {
                    reject(e);
                }
            });
        });
}

function *getByPage(id, edge, qs) {
    let page = yield get(id, edge, qs);
    while(page.paging.cursors.after)
        yield get(id, edge, qs, [...(qs || []), ...[{k: 'after', v: [page.paging.cursors.after]}]])

}

function getAll(id, edge, qs) {   
    return new Promise(
        async (resolve, reject) => {
            let all = {},
                pageIterator = getByPage(id, edge, qs);
            for(let _p of pageIterator) {
                await _p
                    .then(page => all.pagemerge(page))
                    .catch(e => reject(e))
            }
            resolve(all);
    })
}

function post(id, qs, data) {
    return new Promise(
        (resolve, reject) => {
            request.post(
                workplace_graph_url + id + (qs? "/?" + qs.map(e => e.k + "=" + e.v.join(',')).join('&') : ""), {
                headers: {
                    'User-Agent': 'workplace-node-sdk/'+sdk_v,
                    'Authorization': 'Bearer ' + workplace_access_token
                },
                json: true,
                body: data
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

module.exports = {

    setAccessToken: function (token) {
        if(token && typeof(token) == 'string' && token.length > 0)
            workplace_access_token = token;
        return (workplace_access_token === token);
    },
    get: {
        community: function() {
            return get(undefined, 'community')
        },
        groups: {
            all: function() {
                return getAll(undefined, 'community/groups')
            },
            byPage: function() {
                return get()
            }
        },
        members: function() {
            return get(undefined, 'community/members')
        },
        former_members: function() {
            return get(undefined, 'community/former_members')
        },
        admins: function() {
            return get(undefined, 'community/admins')
        },
        reported_content: function() {
            return get(undefined, 'community/reported_content')
        },
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