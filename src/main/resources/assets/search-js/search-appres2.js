/*!
 * jQuery JavaScript Library v1.11.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-05-01T17:42Z
 *//*!
 * Sizzle CSS Selector Engine v1.10.19
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-04-18
 */
(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ? factory(global, true) : function (w) {
            if (!w.document) {
                throw new Error("jQuery requires a window with a document");
            }
            return factory(w);
        };
    } else {
        factory(global);
    }
}(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
    var deletedIds = [];
    var slice = deletedIds.slice;
    var concat = deletedIds.concat;
    var push = deletedIds.push;
    var indexOf = deletedIds.indexOf;
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var support = {};
    var
        version = "1.11.1", jQuery = function (selector, context) {
            return new jQuery.fn.init(selector, context);
        }, rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi,
        fcamelCase = function (all, letter) {
            return letter.toUpperCase();
        };
    jQuery.fn = jQuery.prototype = {
        jquery: version,
        constructor: jQuery,
        selector: "",
        length: 0,
        toArray: function () {
            return slice.call(this);
        },
        get: function (num) {
            return num != null ? (num < 0 ? this[num + this.length] : this[num]) : slice.call(this);
        },
        pushStack: function (elems) {
            var ret = jQuery.merge(this.constructor(), elems);
            ret.prevObject = this;
            ret.context = this.context;
            return ret;
        },
        each: function (callback, args) {
            return jQuery.each(this, callback, args);
        },
        map: function (callback) {
            return this.pushStack(jQuery.map(this, function (elem, i) {
                return callback.call(elem, i, elem);
            }));
        },
        slice: function () {
            return this.pushStack(slice.apply(this, arguments));
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        eq: function (i) {
            var len = this.length, j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        end: function () {
            return this.prevObject || this.constructor(null);
        },
        push: push,
        sort: deletedIds.sort,
        splice: deletedIds.splice
    };
    jQuery.extend = jQuery.fn.extend = function () {
        var src, copyIsArray, copy, name, options, clone, target = arguments[0] || {}, i = 1, length = arguments.length,
            deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }
        if (i === length) {
            target = this;
            i--;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }
                        target[name] = jQuery.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    };
    jQuery.extend({
        expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""), isReady: true, error: function (msg) {
            throw new Error(msg);
        }, noop: function () {
        }, isFunction: function (obj) {
            return jQuery.type(obj) === "function";
        }, isArray: Array.isArray || function (obj) {
            return jQuery.type(obj) === "array";
        }, isWindow: function (obj) {
            return obj != null && obj == obj.window;
        }, isNumeric: function (obj) {
            return !jQuery.isArray(obj) && obj - parseFloat(obj) >= 0;
        }, isEmptyObject: function (obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        }, isPlainObject: function (obj) {
            var key;
            if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
                return false;
            }
            try {
                if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                return false;
            }
            if (support.ownLast) {
                for (key in obj) {
                    return hasOwn.call(obj, key);
                }
            }
            for (key in obj) {
            }
            return key === undefined || hasOwn.call(obj, key);
        }, type: function (obj) {
            if (obj == null) {
                return obj + "";
            }
            return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
        }, globalEval: function (data) {
            if (data && jQuery.trim(data)) {
                (window.execScript || function (data) {
                    window["eval"].call(window, data);
                })(data);
            }
        }, camelCase: function (string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        }, nodeName: function (elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        }, each: function (obj, callback, args) {
            var value, i = 0, length = obj.length, isArray = isArraylike(obj);
            if (args) {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.apply(obj[i], args);
                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.apply(obj[i], args);
                        if (value === false) {
                            break;
                        }
                    }
                }
            } else {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.call(obj[i], i, obj[i]);
                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.call(obj[i], i, obj[i]);
                        if (value === false) {
                            break;
                        }
                    }
                }
            }
            return obj;
        }, trim: function (text) {
            return text == null ? "" : (text + "").replace(rtrim, "");
        }, makeArray: function (arr, results) {
            var ret = results || [];
            if (arr != null) {
                if (isArraylike(Object(arr))) {
                    jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
                } else {
                    push.call(ret, arr);
                }
            }
            return ret;
        }, inArray: function (elem, arr, i) {
            var len;
            if (arr) {
                if (indexOf) {
                    return indexOf.call(arr, elem, i);
                }
                len = arr.length;
                i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
                for (; i < len; i++) {
                    if (i in arr && arr[i] === elem) {
                        return i;
                    }
                }
            }
            return -1;
        }, merge: function (first, second) {
            var len = +second.length, j = 0, i = first.length;
            while (j < len) {
                first[i++] = second[j++];
            }
            if (len !== len) {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }
            first.length = i;
            return first;
        }, grep: function (elems, callback, invert) {
            var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert;
            for (; i < length; i++) {
                callbackInverse = !callback(elems[i], i);
                if (callbackInverse !== callbackExpect) {
                    matches.push(elems[i]);
                }
            }
            return matches;
        }, map: function (elems, callback, arg) {
            var value, i = 0, length = elems.length, isArray = isArraylike(elems), ret = [];
            if (isArray) {
                for (; i < length; i++) {
                    value = callback(elems[i], i, arg);
                    if (value != null) {
                        ret.push(value);
                    }
                }
            } else {
                for (i in elems) {
                    value = callback(elems[i], i, arg);
                    if (value != null) {
                        ret.push(value);
                    }
                }
            }
            return concat.apply([], ret);
        }, guid: 1, proxy: function (fn, context) {
            var args, proxy, tmp;
            if (typeof context === "string") {
                tmp = fn[context];
                context = fn;
                fn = tmp;
            }
            if (!jQuery.isFunction(fn)) {
                return undefined;
            }
            args = slice.call(arguments, 2);
            proxy = function () {
                return fn.apply(context || this, args.concat(slice.call(arguments)));
            };
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;
            return proxy;
        }, now: function () {
            return +(new Date());
        }, support: support
    });
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    function isArraylike(obj) {
        var length = obj.length, type = jQuery.type(obj);
        if (type === "function" || jQuery.isWindow(obj)) {
            return false;
        }
        if (obj.nodeType === 1 && length) {
            return true;
        }
        return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
    }

    var Sizzle = (function (window) {
        var i, support, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate,
            setDocument, document, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains,
            expando = "sizzle" + -(new Date()), preferredDoc = window.document, dirruns = 0, done = 0,
            classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(),
            sortOrder = function (a, b) {
                if (a === b) {
                    hasDuplicate = true;
                }
                return 0;
            }, strundefined = typeof undefined, MAX_NEGATIVE = 1 << 31, hasOwn = ({}).hasOwnProperty, arr = [],
            pop = arr.pop, push_native = arr.push, push = arr.push, slice = arr.slice,
            indexOf = arr.indexOf || function (elem) {
                var i = 0, len = this.length;
                for (; i < len; i++) {
                    if (this[i] === elem) {
                        return i;
                    }
                }
                return -1;
            },
            booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            whitespace = "[\\x20\\t\\r\\n\\f]", characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            identifier = characterEncoding.replace("w", "w#"),
            attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
            pseudos = ":(" + characterEncoding + ")(?:\\((" + "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" + "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" + ".*" + ")\\)|)",
            rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
            rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
            rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
            rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
            rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
                "ID": new RegExp("^#(" + characterEncoding + ")"),
                "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
                "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
                "ATTR": new RegExp("^" + attributes),
                "PSEUDO": new RegExp("^" + pseudos),
                "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
                "bool": new RegExp("^(?:" + booleans + ")$", "i"),
                "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                    whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
            }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rnative = /^[^{]+\{\s*\[native \w/,
            rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, rescape = /'|\\/g,
            runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
            funescape = function (_, escaped, escapedWhitespace) {
                var high = "0x" + escaped - 0x10000;
                return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 0x10000) : String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
            };
        try {
            push.apply((arr = slice.call(preferredDoc.childNodes)), preferredDoc.childNodes);
            arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
            push = {
                apply: arr.length ? function (target, els) {
                    push_native.apply(target, slice.call(els));
                } : function (target, els) {
                    var j = target.length, i = 0;
                    while ((target[j++] = els[i++])) {
                    }
                    target.length = j - 1;
                }
            };
        }

        function Sizzle(selector, context, results, seed) {
            var match, elem, m, nodeType, i, groups, old, nid, newContext, newSelector;
            if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
                setDocument(context);
            }
            context = context || document;
            results = results || [];
            if (!selector || typeof selector !== "string") {
                return results;
            }
            if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
                return [];
            }
            if (documentIsHTML && !seed) {
                if ((match = rquickExpr.exec(selector))) {
                    if ((m = match[1])) {
                        if (nodeType === 9) {
                            elem = context.getElementById(m);
                            if (elem && elem.parentNode) {
                                if (elem.id === m) {
                                    results.push(elem);
                                    return results;
                                }
                            } else {
                                return results;
                            }
                        } else {
                            if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) {
                                results.push(elem);
                                return results;
                            }
                        }
                    } else if (match[2]) {
                        push.apply(results, context.getElementsByTagName(selector));
                        return results;
                    } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
                        push.apply(results, context.getElementsByClassName(m));
                        return results;
                    }
                }
                if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                    nid = old = expando;
                    newContext = context;
                    newSelector = nodeType === 9 && selector;
                    if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                        groups = tokenize(selector);
                        if ((old = context.getAttribute("id"))) {
                            nid = old.replace(rescape, "\\$&");
                        } else {
                            context.setAttribute("id", nid);
                        }
                        nid = "[id='" + nid + "'] ";
                        i = groups.length;
                        while (i--) {
                            groups[i] = nid + toSelector(groups[i]);
                        }
                        newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                        newSelector = groups.join(",");
                    }
                    if (newSelector) {
                        try {
                            push.apply(results, newContext.querySelectorAll(newSelector));
                            return results;
                        } catch (qsaError) {
                        } finally {
                            if (!old) {
                                context.removeAttribute("id");
                            }
                        }
                    }
                }
            }
            return select(selector.replace(rtrim, "$1"), context, results, seed);
        }

        function createCache() {
            var keys = [];

            function cache(key, value) {
                if (keys.push(key + " ") > Expr.cacheLength) {
                    delete cache[keys.shift()];
                }
                return (cache[key + " "] = value);
            }

            return cache;
        }

        function markFunction(fn) {
            fn[expando] = true;
            return fn;
        }

        function assert(fn) {
            var div = document.createElement("div");
            try {
                return !!fn(div);
            } catch (e) {
                return false;
            } finally {
                if (div.parentNode) {
                    div.parentNode.removeChild(div);
                }
                div = null;
            }
        }

        function addHandle(attrs, handler) {
            var arr = attrs.split("|"), i = attrs.length;
            while (i--) {
                Expr.attrHandle[arr[i]] = handler;
            }
        }

        function siblingCheck(a, b) {
            var cur = b && a, diff = cur && a.nodeType === 1 && b.nodeType === 1 && (~b.sourceIndex || MAX_NEGATIVE) -
                (~a.sourceIndex || MAX_NEGATIVE);
            if (diff) {
                return diff;
            }
            if (cur) {
                while ((cur = cur.nextSibling)) {
                    if (cur === b) {
                        return -1;
                    }
                }
            }
            return a ? 1 : -1;
        }

        function createInputPseudo(type) {
            return function (elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === type;
            };
        }

        function createButtonPseudo(type) {
            return function (elem) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && elem.type === type;
            };
        }

        function createPositionalPseudo(fn) {
            return markFunction(function (argument) {
                argument = +argument;
                return markFunction(function (seed, matches) {
                    var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length;
                    while (i--) {
                        if (seed[(j = matchIndexes[i])]) {
                            seed[j] = !(matches[j] = seed[j]);
                        }
                    }
                });
            });
        }

        function testContext(context) {
            return context && typeof context.getElementsByTagName !== strundefined && context;
        }

        support = Sizzle.support = {};
        isXML = Sizzle.isXML = function (elem) {
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };
        setDocument = Sizzle.setDocument = function (node) {
            var hasCompare, doc = node ? node.ownerDocument || node : preferredDoc, parent = doc.defaultView;
            if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
                return document;
            }
            document = doc;
            docElem = doc.documentElement;
            documentIsHTML = !isXML(doc);
            if (parent && parent !== parent.top) {
                if (parent.addEventListener) {
                    parent.addEventListener("unload", function () {
                        setDocument();
                    }, false);
                } else if (parent.attachEvent) {
                    parent.attachEvent("onunload", function () {
                        setDocument();
                    });
                }
            }
            support.attributes = assert(function (div) {
                div.className = "i";
                return !div.getAttribute("className");
            });
            support.getElementsByTagName = assert(function (div) {
                div.appendChild(doc.createComment(""));
                return !div.getElementsByTagName("*").length;
            });
            support.getElementsByClassName = rnative.test(doc.getElementsByClassName) && assert(function (div) {
                div.innerHTML = "<div class='a'></div><div class='a i'></div>";
                div.firstChild.className = "i";
                return div.getElementsByClassName("i").length === 2;
            });
            support.getById = assert(function (div) {
                docElem.appendChild(div).id = expando;
                return !doc.getElementsByName || !doc.getElementsByName(expando).length;
            });
            if (support.getById) {
                Expr.find["ID"] = function (id, context) {
                    if (typeof context.getElementById !== strundefined && documentIsHTML) {
                        var m = context.getElementById(id);
                        return m && m.parentNode ? [m] : [];
                    }
                };
                Expr.filter["ID"] = function (id) {
                    var attrId = id.replace(runescape, funescape);
                    return function (elem) {
                        return elem.getAttribute("id") === attrId;
                    };
                };
            } else {
                delete Expr.find["ID"];
                Expr.filter["ID"] = function (id) {
                    var attrId = id.replace(runescape, funescape);
                    return function (elem) {
                        var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                        return node && node.value === attrId;
                    };
                };
            }
            Expr.find["TAG"] = support.getElementsByTagName ? function (tag, context) {
                if (typeof context.getElementsByTagName !== strundefined) {
                    return context.getElementsByTagName(tag);
                }
            } : function (tag, context) {
                var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
                if (tag === "*") {
                    while ((elem = results[i++])) {
                        if (elem.nodeType === 1) {
                            tmp.push(elem);
                        }
                    }
                    return tmp;
                }
                return results;
            };
            Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
                if (typeof context.getElementsByClassName !== strundefined && documentIsHTML) {
                    return context.getElementsByClassName(className);
                }
            };
            rbuggyMatches = [];
            rbuggyQSA = [];
            if ((support.qsa = rnative.test(doc.querySelectorAll))) {
                assert(function (div) {
                    div.innerHTML = "<select msallowclip=''><option selected=''></option></select>";
                    if (div.querySelectorAll("[msallowclip^='']").length) {
                        rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
                    }
                    if (!div.querySelectorAll("[selected]").length) {
                        rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
                    }
                    if (!div.querySelectorAll(":checked").length) {
                        rbuggyQSA.push(":checked");
                    }
                });
                assert(function (div) {
                    var input = doc.createElement("input");
                    input.setAttribute("type", "hidden");
                    div.appendChild(input).setAttribute("name", "D");
                    if (div.querySelectorAll("[name=d]").length) {
                        rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
                    }
                    if (!div.querySelectorAll(":enabled").length) {
                        rbuggyQSA.push(":enabled", ":disabled");
                    }
                    div.querySelectorAll("*,:x");
                    rbuggyQSA.push(",.*:");
                });
            }
            if ((support.matchesSelector = rnative.test((matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)))) {
                assert(function (div) {
                    support.disconnectedMatch = matches.call(div, "div");
                    matches.call(div, "[s!='']:x");
                    rbuggyMatches.push("!=", pseudos);
                });
            }
            rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
            rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
            hasCompare = rnative.test(docElem.compareDocumentPosition);
            contains = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
                return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
            } : function (a, b) {
                if (b) {
                    while ((b = b.parentNode)) {
                        if (b === a) {
                            return true;
                        }
                    }
                }
                return false;
            };
            sortOrder = hasCompare ? function (a, b) {
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }
                var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                if (compare) {
                    return compare;
                }
                compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;
                if (compare & 1 || (!support.sortDetached && b.compareDocumentPosition(a) === compare)) {
                    if (a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
                        return -1;
                    }
                    if (b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
                        return 1;
                    }
                    return sortInput ? (indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) : 0;
                }
                return compare & 4 ? -1 : 1;
            } : function (a, b) {
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }
                var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [a], bp = [b];
                if (!aup || !bup) {
                    return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? (indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) : 0;
                } else if (aup === bup) {
                    return siblingCheck(a, b);
                }
                cur = a;
                while ((cur = cur.parentNode)) {
                    ap.unshift(cur);
                }
                cur = b;
                while ((cur = cur.parentNode)) {
                    bp.unshift(cur);
                }
                while (ap[i] === bp[i]) {
                    i++;
                }
                return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
            };
            return doc;
        };
        Sizzle.matches = function (expr, elements) {
            return Sizzle(expr, null, null, elements);
        };
        Sizzle.matchesSelector = function (elem, expr) {
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }
            expr = expr.replace(rattributeQuotes, "='$1']");
            if (support.matchesSelector && documentIsHTML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
                try {
                    var ret = matches.call(elem, expr);
                    if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
                        return ret;
                    }
                } catch (e) {
                }
            }
            return Sizzle(expr, document, null, [elem]).length > 0;
        };
        Sizzle.contains = function (context, elem) {
            if ((context.ownerDocument || context) !== document) {
                setDocument(context);
            }
            return contains(context, elem);
        };
        Sizzle.attr = function (elem, name) {
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }
            var fn = Expr.attrHandle[name.toLowerCase()],
                val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;
            return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
        };
        Sizzle.error = function (msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        };
        Sizzle.uniqueSort = function (results) {
            var elem, duplicates = [], j = 0, i = 0;
            hasDuplicate = !support.detectDuplicates;
            sortInput = !support.sortStable && results.slice(0);
            results.sort(sortOrder);
            if (hasDuplicate) {
                while ((elem = results[i++])) {
                    if (elem === results[i]) {
                        j = duplicates.push(i);
                    }
                }
                while (j--) {
                    results.splice(duplicates[j], 1);
                }
            }
            sortInput = null;
            return results;
        };
        getText = Sizzle.getText = function (elem) {
            var node, ret = "", i = 0, nodeType = elem.nodeType;
            if (!nodeType) {
                while ((node = elem[i++])) {
                    ret += getText(node);
                }
            } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                if (typeof elem.textContent === "string") {
                    return elem.textContent;
                } else {
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        ret += getText(elem);
                    }
                }
            } else if (nodeType === 3 || nodeType === 4) {
                return elem.nodeValue;
            }
            return ret;
        };
        Expr = Sizzle.selectors = {
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            attrHandle: {},
            find: {},
            relative: {
                ">": {dir: "parentNode", first: true},
                " ": {dir: "parentNode"},
                "+": {dir: "previousSibling", first: true},
                "~": {dir: "previousSibling"}
            },
            preFilter: {
                "ATTR": function (match) {
                    match[1] = match[1].replace(runescape, funescape);
                    match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
                    if (match[2] === "~=") {
                        match[3] = " " + match[3] + " ";
                    }
                    return match.slice(0, 4);
                }, "CHILD": function (match) {
                    match[1] = match[1].toLowerCase();
                    if (match[1].slice(0, 3) === "nth") {
                        if (!match[3]) {
                            Sizzle.error(match[0]);
                        }
                        match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                        match[5] = +((match[7] + match[8]) || match[3] === "odd");
                    } else if (match[3]) {
                        Sizzle.error(match[0]);
                    }
                    return match;
                }, "PSEUDO": function (match) {
                    var excess, unquoted = !match[6] && match[2];
                    if (matchExpr["CHILD"].test(match[0])) {
                        return null;
                    }
                    if (match[3]) {
                        match[2] = match[4] || match[5] || "";
                    } else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                        match[0] = match[0].slice(0, excess);
                        match[2] = unquoted.slice(0, excess);
                    }
                    return match.slice(0, 3);
                }
            },
            filter: {
                "TAG": function (nodeNameSelector) {
                    var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                    return nodeNameSelector === "*" ? function () {
                        return true;
                    } : function (elem) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
                }, "CLASS": function (className) {
                    var pattern = classCache[className + " "];
                    return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function (elem) {
                        return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
                    });
                }, "ATTR": function (name, operator, check) {
                    return function (elem) {
                        var result = Sizzle.attr(elem, name);
                        if (result == null) {
                            return operator === "!=";
                        }
                        if (!operator) {
                            return true;
                        }
                        result += "";
                        return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
                    };
                }, "CHILD": function (type, what, argument, first, last) {
                    var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last",
                        ofType = what === "of-type";
                    return first === 1 && last === 0 ? function (elem) {
                        return !!elem.parentNode;
                    } : function (elem, context, xml) {
                        var cache, outerCache, node, diff, nodeIndex, start,
                            dir = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode,
                            name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType;
                        if (parent) {
                            if (simple) {
                                while (dir) {
                                    node = elem;
                                    while ((node = node[dir])) {
                                        if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                                            return false;
                                        }
                                    }
                                    start = dir = type === "only" && !start && "nextSibling";
                                }
                                return true;
                            }
                            start = [forward ? parent.firstChild : parent.lastChild];
                            if (forward && useCache) {
                                outerCache = parent[expando] || (parent[expando] = {});
                                cache = outerCache[type] || [];
                                nodeIndex = cache[0] === dirruns && cache[1];
                                diff = cache[0] === dirruns && cache[2];
                                node = nodeIndex && parent.childNodes[nodeIndex];
                                while ((node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop())) {
                                    if (node.nodeType === 1 && ++diff && node === elem) {
                                        outerCache[type] = [dirruns, nodeIndex, diff];
                                        break;
                                    }
                                }
                            } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
                                diff = cache[1];
                            } else {
                                while ((node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop())) {
                                    if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                                        if (useCache) {
                                            (node[expando] || (node[expando] = {}))[type] = [dirruns, diff];
                                        }
                                        if (node === elem) {
                                            break;
                                        }
                                    }
                                }
                            }
                            diff -= last;
                            return diff === first || (diff % first === 0 && diff / first >= 0);
                        }
                    };
                }, "PSEUDO": function (pseudo, argument) {
                    var args,
                        fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
                    if (fn[expando]) {
                        return fn(argument);
                    }
                    if (fn.length > 1) {
                        args = [pseudo, pseudo, "", argument];
                        return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
                            var idx, matched = fn(seed, argument), i = matched.length;
                            while (i--) {
                                idx = indexOf.call(seed, matched[i]);
                                seed[idx] = !(matches[idx] = matched[i]);
                            }
                        }) : function (elem) {
                            return fn(elem, 0, args);
                        };
                    }
                    return fn;
                }
            },
            pseudos: {
                "not": markFunction(function (selector) {
                    var input = [], results = [], matcher = compile(selector.replace(rtrim, "$1"));
                    return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
                        var elem, unmatched = matcher(seed, null, xml, []), i = seed.length;
                        while (i--) {
                            if ((elem = unmatched[i])) {
                                seed[i] = !(matches[i] = elem);
                            }
                        }
                    }) : function (elem, context, xml) {
                        input[0] = elem;
                        matcher(input, null, xml, results);
                        return !results.pop();
                    };
                }), "has": markFunction(function (selector) {
                    return function (elem) {
                        return Sizzle(selector, elem).length > 0;
                    };
                }), "contains": markFunction(function (text) {
                    return function (elem) {
                        return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                    };
                }), "lang": markFunction(function (lang) {
                    if (!ridentifier.test(lang || "")) {
                        Sizzle.error("unsupported lang: " + lang);
                    }
                    lang = lang.replace(runescape, funescape).toLowerCase();
                    return function (elem) {
                        var elemLang;
                        do {
                            if ((elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {
                                elemLang = elemLang.toLowerCase();
                                return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                            }
                        } while ((elem = elem.parentNode) && elem.nodeType === 1);
                        return false;
                    };
                }), "target": function (elem) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice(1) === elem.id;
                }, "root": function (elem) {
                    return elem === docElem;
                }, "focus": function (elem) {
                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                }, "enabled": function (elem) {
                    return elem.disabled === false;
                }, "disabled": function (elem) {
                    return elem.disabled === true;
                }, "checked": function (elem) {
                    var nodeName = elem.nodeName.toLowerCase();
                    return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                }, "selected": function (elem) {
                    if (elem.parentNode) {
                        elem.parentNode.selectedIndex;
                    }
                    return elem.selected === true;
                }, "empty": function (elem) {
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        if (elem.nodeType < 6) {
                            return false;
                        }
                    }
                    return true;
                }, "parent": function (elem) {
                    return !Expr.pseudos["empty"](elem);
                }, "header": function (elem) {
                    return rheader.test(elem.nodeName);
                }, "input": function (elem) {
                    return rinputs.test(elem.nodeName);
                }, "button": function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === "button" || name === "button";
                }, "text": function (elem) {
                    var attr;
                    return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
                }, "first": createPositionalPseudo(function () {
                    return [0];
                }), "last": createPositionalPseudo(function (matchIndexes, length) {
                    return [length - 1];
                }), "eq": createPositionalPseudo(function (matchIndexes, length, argument) {
                    return [argument < 0 ? argument + length : argument];
                }), "even": createPositionalPseudo(function (matchIndexes, length) {
                    var i = 0;
                    for (; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }), "odd": createPositionalPseudo(function (matchIndexes, length) {
                    var i = 1;
                    for (; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }), "lt": createPositionalPseudo(function (matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (; --i >= 0;) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }), "gt": createPositionalPseudo(function (matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (; ++i < length;) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                })
            }
        };
        Expr.pseudos["nth"] = Expr.pseudos["eq"];
        for (i in{radio: true, checkbox: true, file: true, password: true, image: true}) {
            Expr.pseudos[i] = createInputPseudo(i);
        }
        for (i in{submit: true, reset: true}) {
            Expr.pseudos[i] = createButtonPseudo(i);
        }

        function setFilters() {
        }

        setFilters.prototype = Expr.filters = Expr.pseudos;
        Expr.setFilters = new setFilters();
        tokenize = Sizzle.tokenize = function (selector, parseOnly) {
            var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
            if (cached) {
                return parseOnly ? 0 : cached.slice(0);
            }
            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;
            while (soFar) {
                if (!matched || (match = rcomma.exec(soFar))) {
                    if (match) {
                        soFar = soFar.slice(match[0].length) || soFar;
                    }
                    groups.push((tokens = []));
                }
                matched = false;
                if ((match = rcombinators.exec(soFar))) {
                    matched = match.shift();
                    tokens.push({value: matched, type: match[0].replace(rtrim, " ")});
                    soFar = soFar.slice(matched.length);
                }
                for (type in Expr.filter) {
                    if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                        matched = match.shift();
                        tokens.push({value: matched, type: type, matches: match});
                        soFar = soFar.slice(matched.length);
                    }
                }
                if (!matched) {
                    break;
                }
            }
            return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
        };

        function toSelector(tokens) {
            var i = 0, len = tokens.length, selector = "";
            for (; i < len; i++) {
                selector += tokens[i].value;
            }
            return selector;
        }

        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir, checkNonElements = base && dir === "parentNode", doneName = done++;
            return combinator.first ? function (elem, context, xml) {
                while ((elem = elem[dir])) {
                    if (elem.nodeType === 1 || checkNonElements) {
                        return matcher(elem, context, xml);
                    }
                }
            } : function (elem, context, xml) {
                var oldCache, outerCache, newCache = [dirruns, doneName];
                if (xml) {
                    while ((elem = elem[dir])) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            if (matcher(elem, context, xml)) {
                                return true;
                            }
                        }
                    }
                } else {
                    while ((elem = elem[dir])) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            outerCache = elem[expando] || (elem[expando] = {});
                            if ((oldCache = outerCache[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                                return (newCache[2] = oldCache[2]);
                            } else {
                                outerCache[dir] = newCache;
                                if ((newCache[2] = matcher(elem, context, xml))) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            };
        }

        function elementMatcher(matchers) {
            return matchers.length > 1 ? function (elem, context, xml) {
                var i = matchers.length;
                while (i--) {
                    if (!matchers[i](elem, context, xml)) {
                        return false;
                    }
                }
                return true;
            } : matchers[0];
        }

        function multipleContexts(selector, contexts, results) {
            var i = 0, len = contexts.length;
            for (; i < len; i++) {
                Sizzle(selector, contexts[i], results);
            }
            return results;
        }

        function condense(unmatched, map, filter, context, xml) {
            var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = map != null;
            for (; i < len; i++) {
                if ((elem = unmatched[i])) {
                    if (!filter || filter(elem, context, xml)) {
                        newUnmatched.push(elem);
                        if (mapped) {
                            map.push(i);
                        }
                    }
                }
            }
            return newUnmatched;
        }

        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
                postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
                postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function (seed, results, context, xml) {
                var temp, i, elem, preMap = [], postMap = [], preexisting = results.length,
                    elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),
                    matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
                    matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
                if (matcher) {
                    matcher(matcherIn, matcherOut, context, xml);
                }
                if (postFilter) {
                    temp = condense(matcherOut, postMap);
                    postFilter(temp, [], context, xml);
                    i = temp.length;
                    while (i--) {
                        if ((elem = temp[i])) {
                            matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                        }
                    }
                }
                if (seed) {
                    if (postFinder || preFilter) {
                        if (postFinder) {
                            temp = [];
                            i = matcherOut.length;
                            while (i--) {
                                if ((elem = matcherOut[i])) {
                                    temp.push((matcherIn[i] = elem));
                                }
                            }
                            postFinder(null, (matcherOut = []), temp, xml);
                        }
                        i = matcherOut.length;
                        while (i--) {
                            if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {
                                seed[temp] = !(results[temp] = elem);
                            }
                        }
                    }
                } else {
                    matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
                    if (postFinder) {
                        postFinder(null, results, matcherOut, xml);
                    } else {
                        push.apply(results, matcherOut);
                    }
                }
            });
        }

        function matcherFromTokens(tokens) {
            var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type],
                implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0,
                matchContext = addCombinator(function (elem) {
                    return elem === checkContext;
                }, implicitRelative, true), matchAnyContext = addCombinator(function (elem) {
                    return indexOf.call(checkContext, elem) > -1;
                }, implicitRelative, true), matchers = [function (elem, context, xml) {
                    return (!leadingRelative && (xml || context !== outermostContext)) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
                }];
            for (; i < len; i++) {
                if ((matcher = Expr.relative[tokens[i].type])) {
                    matchers = [addCombinator(elementMatcher(matchers), matcher)];
                } else {
                    matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
                    if (matcher[expando]) {
                        j = ++i;
                        for (; j < len; j++) {
                            if (Expr.relative[tokens[j].type]) {
                                break;
                            }
                        }
                        return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({value: tokens[i - 2].type === " " ? "*" : ""})).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens((tokens = tokens.slice(j))), j < len && toSelector(tokens));
                    }
                    matchers.push(matcher);
                }
            }
            return elementMatcher(matchers);
        }

        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0,
                superMatcher = function (seed, context, xml, results, outermost) {
                    var elem, j, matcher, matchedCount = 0, i = "0", unmatched = seed && [], setMatched = [],
                        contextBackup = outermostContext, elems = seed || byElement && Expr.find["TAG"]("*", outermost),
                        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                        len = elems.length;
                    if (outermost) {
                        outermostContext = context !== document && context;
                    }
                    for (; i !== len && (elem = elems[i]) != null; i++) {
                        if (byElement && elem) {
                            j = 0;
                            while ((matcher = elementMatchers[j++])) {
                                if (matcher(elem, context, xml)) {
                                    results.push(elem);
                                    break;
                                }
                            }
                            if (outermost) {
                                dirruns = dirrunsUnique;
                            }
                        }
                        if (bySet) {
                            if ((elem = !matcher && elem)) {
                                matchedCount--;
                            }
                            if (seed) {
                                unmatched.push(elem);
                            }
                        }
                    }
                    matchedCount += i;
                    if (bySet && i !== matchedCount) {
                        j = 0;
                        while ((matcher = setMatchers[j++])) {
                            matcher(unmatched, setMatched, context, xml);
                        }
                        if (seed) {
                            if (matchedCount > 0) {
                                while (i--) {
                                    if (!(unmatched[i] || setMatched[i])) {
                                        setMatched[i] = pop.call(results);
                                    }
                                }
                            }
                            setMatched = condense(setMatched);
                        }
                        push.apply(results, setMatched);
                        if (outermost && !seed && setMatched.length > 0 && (matchedCount + setMatchers.length) > 1) {
                            Sizzle.uniqueSort(results);
                        }
                    }
                    if (outermost) {
                        dirruns = dirrunsUnique;
                        outermostContext = contextBackup;
                    }
                    return unmatched;
                };
            return bySet ? markFunction(superMatcher) : superMatcher;
        }

        compile = Sizzle.compile = function (selector, match) {
            var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
            if (!cached) {
                if (!match) {
                    match = tokenize(selector);
                }
                i = match.length;
                while (i--) {
                    cached = matcherFromTokens(match[i]);
                    if (cached[expando]) {
                        setMatchers.push(cached);
                    } else {
                        elementMatchers.push(cached);
                    }
                }
                cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
                cached.selector = selector;
            }
            return cached;
        };
        select = Sizzle.select = function (selector, context, results, seed) {
            var i, tokens, token, type, find, compiled = typeof selector === "function" && selector,
                match = !seed && tokenize((selector = compiled.selector || selector));
            results = results || [];
            if (match.length === 1) {
                tokens = match[0] = match[0].slice(0);
                if (tokens.length > 2 && (token = tokens[0]).type === "ID" && support.getById && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
                    context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
                    if (!context) {
                        return results;
                    } else if (compiled) {
                        context = context.parentNode;
                    }
                    selector = selector.slice(tokens.shift().value.length);
                }
                i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
                while (i--) {
                    token = tokens[i];
                    if (Expr.relative[(type = token.type)]) {
                        break;
                    }
                    if ((find = Expr.find[type])) {
                        if ((seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context))) {
                            tokens.splice(i, 1);
                            selector = seed.length && toSelector(tokens);
                            if (!selector) {
                                push.apply(results, seed);
                                return results;
                            }
                            break;
                        }
                    }
                }
            }
            (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, rsibling.test(selector) && testContext(context.parentNode) || context);
            return results;
        };
        support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
        support.detectDuplicates = !!hasDuplicate;
        setDocument();
        support.sortDetached = assert(function (div1) {
            return div1.compareDocumentPosition(document.createElement("div")) & 1;
        });
        if (!assert(function (div) {
            div.innerHTML = "<a href='#'></a>";
            return div.firstChild.getAttribute("href") === "#";
        })) {
            addHandle("type|href|height|width", function (elem, name, isXML) {
                if (!isXML) {
                    return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
                }
            });
        }
        if (!support.attributes || !assert(function (div) {
            div.innerHTML = "<input/>";
            div.firstChild.setAttribute("value", "");
            return div.firstChild.getAttribute("value") === "";
        })) {
            addHandle("value", function (elem, name, isXML) {
                if (!isXML && elem.nodeName.toLowerCase() === "input") {
                    return elem.defaultValue;
                }
            });
        }
        if (!assert(function (div) {
            return div.getAttribute("disabled") == null;
        })) {
            addHandle(booleans, function (elem, name, isXML) {
                var val;
                if (!isXML) {
                    return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
                }
            });
        }
        return Sizzle;
    })(window);
    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[":"] = jQuery.expr.pseudos;
    jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;
    var rneedsContext = jQuery.expr.match.needsContext;
    var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);
    var risSimple = /^.[^:#\[\.,]*$/;

    function winnow(elements, qualifier, not) {
        if (jQuery.isFunction(qualifier)) {
            return jQuery.grep(elements, function (elem, i) {
                return !!qualifier.call(elem, i, elem) !== not;
            });
        }
        if (qualifier.nodeType) {
            return jQuery.grep(elements, function (elem) {
                return (elem === qualifier) !== not;
            });
        }
        if (typeof qualifier === "string") {
            if (risSimple.test(qualifier)) {
                return jQuery.filter(qualifier, elements, not);
            }
            qualifier = jQuery.filter(qualifier, elements);
        }
        return jQuery.grep(elements, function (elem) {
            return (jQuery.inArray(elem, qualifier) >= 0) !== not;
        });
    }

    jQuery.filter = function (expr, elems, not) {
        var elem = elems[0];
        if (not) {
            expr = ":not(" + expr + ")";
        }
        return elems.length === 1 && elem.nodeType === 1 ? jQuery.find.matchesSelector(elem, expr) ? [elem] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
            return elem.nodeType === 1;
        }));
    };
    jQuery.fn.extend({
        find: function (selector) {
            var i, ret = [], self = this, len = self.length;
            if (typeof selector !== "string") {
                return this.pushStack(jQuery(selector).filter(function () {
                    for (i = 0; i < len; i++) {
                        if (jQuery.contains(self[i], this)) {
                            return true;
                        }
                    }
                }));
            }
            for (i = 0; i < len; i++) {
                jQuery.find(selector, self[i], ret);
            }
            ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
            ret.selector = this.selector ? this.selector + " " + selector : selector;
            return ret;
        }, filter: function (selector) {
            return this.pushStack(winnow(this, selector || [], false));
        }, not: function (selector) {
            return this.pushStack(winnow(this, selector || [], true));
        }, is: function (selector) {
            return !!winnow(this, typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
        }
    });
    var rootjQuery, document = window.document, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        init = jQuery.fn.init = function (selector, context) {
            var match, elem;
            if (!selector) {
                return this;
            }
            if (typeof selector === "string") {
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                    match = [null, selector, null];
                } else {
                    match = rquickExpr.exec(selector);
                }
                if (match && (match[1] || !context)) {
                    if (match[1]) {
                        context = context instanceof jQuery ? context[0] : context;
                        jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));
                        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                            for (match in context) {
                                if (jQuery.isFunction(this[match])) {
                                    this[match](context[match]);
                                } else {
                                    this.attr(match, context[match]);
                                }
                            }
                        }
                        return this;
                    } else {
                        elem = document.getElementById(match[2]);
                        if (elem && elem.parentNode) {
                            if (elem.id !== match[2]) {
                                return rootjQuery.find(selector);
                            }
                            this.length = 1;
                            this[0] = elem;
                        }
                        this.context = document;
                        this.selector = selector;
                        return this;
                    }
                } else if (!context || context.jquery) {
                    return (context || rootjQuery).find(selector);
                } else {
                    return this.constructor(context).find(selector);
                }
            } else if (selector.nodeType) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            } else if (jQuery.isFunction(selector)) {
                return typeof rootjQuery.ready !== "undefined" ? rootjQuery.ready(selector) : selector(jQuery);
            }
            if (selector.selector !== undefined) {
                this.selector = selector.selector;
                this.context = selector.context;
            }
            return jQuery.makeArray(selector, this);
        };
    init.prototype = jQuery.fn;
    rootjQuery = jQuery(document);
    var rparentsprev = /^(?:parents|prev(?:Until|All))/,
        guaranteedUnique = {children: true, contents: true, next: true, prev: true};
    jQuery.extend({
        dir: function (elem, dir, until) {
            var matched = [], cur = elem[dir];
            while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
                if (cur.nodeType === 1) {
                    matched.push(cur);
                }
                cur = cur[dir];
            }
            return matched;
        }, sibling: function (n, elem) {
            var r = [];
            for (; n; n = n.nextSibling) {
                if (n.nodeType === 1 && n !== elem) {
                    r.push(n);
                }
            }
            return r;
        }
    });
    jQuery.fn.extend({
        has: function (target) {
            var i, targets = jQuery(target, this), len = targets.length;
            return this.filter(function () {
                for (i = 0; i < len; i++) {
                    if (jQuery.contains(this, targets[i])) {
                        return true;
                    }
                }
            });
        }, closest: function (selectors, context) {
            var cur, i = 0, l = this.length, matched = [],
                pos = rneedsContext.test(selectors) || typeof selectors !== "string" ? jQuery(selectors, context || this.context) : 0;
            for (; i < l; i++) {
                for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
                    if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 : cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {
                        matched.push(cur);
                        break;
                    }
                }
            }
            return this.pushStack(matched.length > 1 ? jQuery.unique(matched) : matched);
        }, index: function (elem) {
            if (!elem) {
                return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1;
            }
            if (typeof elem === "string") {
                return jQuery.inArray(this[0], jQuery(elem));
            }
            return jQuery.inArray(elem.jquery ? elem[0] : elem, this);
        }, add: function (selector, context) {
            return this.pushStack(jQuery.unique(jQuery.merge(this.get(), jQuery(selector, context))));
        }, addBack: function (selector) {
            return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
        }
    });

    function sibling(cur, dir) {
        do {
            cur = cur[dir];
        } while (cur && cur.nodeType !== 1);
        return cur;
    }

    jQuery.each({
        parent: function (elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        }, parents: function (elem) {
            return jQuery.dir(elem, "parentNode");
        }, parentsUntil: function (elem, i, until) {
            return jQuery.dir(elem, "parentNode", until);
        }, next: function (elem) {
            return sibling(elem, "nextSibling");
        }, prev: function (elem) {
            return sibling(elem, "previousSibling");
        }, nextAll: function (elem) {
            return jQuery.dir(elem, "nextSibling");
        }, prevAll: function (elem) {
            return jQuery.dir(elem, "previousSibling");
        }, nextUntil: function (elem, i, until) {
            return jQuery.dir(elem, "nextSibling", until);
        }, prevUntil: function (elem, i, until) {
            return jQuery.dir(elem, "previousSibling", until);
        }, siblings: function (elem) {
            return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
        }, children: function (elem) {
            return jQuery.sibling(elem.firstChild);
        }, contents: function (elem) {
            return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes);
        }
    }, function (name, fn) {
        jQuery.fn[name] = function (until, selector) {
            var ret = jQuery.map(this, fn, until);
            if (name.slice(-5) !== "Until") {
                selector = until;
            }
            if (selector && typeof selector === "string") {
                ret = jQuery.filter(selector, ret);
            }
            if (this.length > 1) {
                if (!guaranteedUnique[name]) {
                    ret = jQuery.unique(ret);
                }
                if (rparentsprev.test(name)) {
                    ret = ret.reverse();
                }
            }
            return this.pushStack(ret);
        };
    });
    var rnotwhite = (/\S+/g);
    var optionsCache = {};

    function createOptions(options) {
        var object = optionsCache[options] = {};
        jQuery.each(options.match(rnotwhite) || [], function (_, flag) {
            object[flag] = true;
        });
        return object;
    }

    jQuery.Callbacks = function (options) {
        options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : jQuery.extend({}, options);
        var
            firing, memory, fired, firingLength, firingIndex, firingStart, list = [], stack = !options.once && [],
            fire = function (data) {
                memory = options.memory && data;
                fired = true;
                firingIndex = firingStart || 0;
                firingStart = 0;
                firingLength = list.length;
                firing = true;
                for (; list && firingIndex < firingLength; firingIndex++) {
                    if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                        memory = false;
                        break;
                    }
                }
                firing = false;
                if (list) {
                    if (stack) {
                        if (stack.length) {
                            fire(stack.shift());
                        }
                    } else if (memory) {
                        list = [];
                    } else {
                        self.disable();
                    }
                }
            }, self = {
                add: function () {
                    if (list) {
                        var start = list.length;
                        (function add(args) {
                            jQuery.each(args, function (_, arg) {
                                var type = jQuery.type(arg);
                                if (type === "function") {
                                    if (!options.unique || !self.has(arg)) {
                                        list.push(arg);
                                    }
                                } else if (arg && arg.length && type !== "string") {
                                    add(arg);
                                }
                            });
                        })(arguments);
                        if (firing) {
                            firingLength = list.length;
                        } else if (memory) {
                            firingStart = start;
                            fire(memory);
                        }
                    }
                    return this;
                }, remove: function () {
                    if (list) {
                        jQuery.each(arguments, function (_, arg) {
                            var index;
                            while ((index = jQuery.inArray(arg, list, index)) > -1) {
                                list.splice(index, 1);
                                if (firing) {
                                    if (index <= firingLength) {
                                        firingLength--;
                                    }
                                    if (index <= firingIndex) {
                                        firingIndex--;
                                    }
                                }
                            }
                        });
                    }
                    return this;
                }, has: function (fn) {
                    return fn ? jQuery.inArray(fn, list) > -1 : !!(list && list.length);
                }, empty: function () {
                    list = [];
                    firingLength = 0;
                    return this;
                }, disable: function () {
                    list = stack = memory = undefined;
                    return this;
                }, disabled: function () {
                    return !list;
                }, lock: function () {
                    stack = undefined;
                    if (!memory) {
                        self.disable();
                    }
                    return this;
                }, locked: function () {
                    return !stack;
                }, fireWith: function (context, args) {
                    if (list && (!fired || stack)) {
                        args = args || [];
                        args = [context, args.slice ? args.slice() : args];
                        if (firing) {
                            stack.push(args);
                        } else {
                            fire(args);
                        }
                    }
                    return this;
                }, fire: function () {
                    self.fireWith(this, arguments);
                    return this;
                }, fired: function () {
                    return !!fired;
                }
            };
        return self;
    };
    jQuery.extend({
        Deferred: function (func) {
            var tuples = [["resolve", "done", jQuery.Callbacks("once memory"), "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"], ["notify", "progress", jQuery.Callbacks("memory")]],
                state = "pending", promise = {
                    state: function () {
                        return state;
                    }, always: function () {
                        deferred.done(arguments).fail(arguments);
                        return this;
                    }, then: function () {
                        var fns = arguments;
                        return jQuery.Deferred(function (newDefer) {
                            jQuery.each(tuples, function (i, tuple) {
                                var fn = jQuery.isFunction(fns[i]) && fns[i];
                                deferred[tuple[1]](function () {
                                    var returned = fn && fn.apply(this, arguments);
                                    if (returned && jQuery.isFunction(returned.promise)) {
                                        returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
                                    } else {
                                        newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                                    }
                                });
                            });
                            fns = null;
                        }).promise();
                    }, promise: function (obj) {
                        return obj != null ? jQuery.extend(obj, promise) : promise;
                    }
                }, deferred = {};
            promise.pipe = promise.then;
            jQuery.each(tuples, function (i, tuple) {
                var list = tuple[2], stateString = tuple[3];
                promise[tuple[1]] = list.add;
                if (stateString) {
                    list.add(function () {
                        state = stateString;
                    }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
                }
                deferred[tuple[0]] = function () {
                    deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
                    return this;
                };
                deferred[tuple[0] + "With"] = list.fireWith;
            });
            promise.promise(deferred);
            if (func) {
                func.call(deferred, deferred);
            }
            return deferred;
        }, when: function (subordinate) {
            var i = 0, resolveValues = slice.call(arguments), length = resolveValues.length,
                remaining = length !== 1 || (subordinate && jQuery.isFunction(subordinate.promise)) ? length : 0,
                deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
                updateFunc = function (i, contexts, values) {
                    return function (value) {
                        contexts[i] = this;
                        values[i] = arguments.length > 1 ? slice.call(arguments) : value;
                        if (values === progressValues) {
                            deferred.notifyWith(contexts, values);
                        } else if (!(--remaining)) {
                            deferred.resolveWith(contexts, values);
                        }
                    };
                }, progressValues, progressContexts, resolveContexts;
            if (length > 1) {
                progressValues = new Array(length);
                progressContexts = new Array(length);
                resolveContexts = new Array(length);
                for (; i < length; i++) {
                    if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
                        resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues));
                    } else {
                        --remaining;
                    }
                }
            }
            if (!remaining) {
                deferred.resolveWith(resolveContexts, resolveValues);
            }
            return deferred.promise();
        }
    });
    var readyList;
    jQuery.fn.ready = function (fn) {
        jQuery.ready.promise().done(fn);
        return this;
    };
    jQuery.extend({
        isReady: false, readyWait: 1, holdReady: function (hold) {
            if (hold) {
                jQuery.readyWait++;
            } else {
                jQuery.ready(true);
            }
        }, ready: function (wait) {
            if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
                return;
            }
            if (!document.body) {
                return setTimeout(jQuery.ready);
            }
            jQuery.isReady = true;
            if (wait !== true && --jQuery.readyWait > 0) {
                return;
            }
            readyList.resolveWith(document, [jQuery]);
            if (jQuery.fn.triggerHandler) {
                jQuery(document).triggerHandler("ready");
                jQuery(document).off("ready");
            }
        }
    });

    function detach() {
        if (document.addEventListener) {
            document.removeEventListener("DOMContentLoaded", completed, false);
            window.removeEventListener("load", completed, false);
        } else {
            document.detachEvent("onreadystatechange", completed);
            window.detachEvent("onload", completed);
        }
    }

    function completed() {
        if (document.addEventListener || event.type === "load" || document.readyState === "complete") {
            detach();
            jQuery.ready();
        }
    }

    jQuery.ready.promise = function (obj) {
        if (!readyList) {
            readyList = jQuery.Deferred();
            if (document.readyState === "complete") {
                setTimeout(jQuery.ready);
            } else if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", completed, false);
                window.addEventListener("load", completed, false);
            } else {
                document.attachEvent("onreadystatechange", completed);
                window.attachEvent("onload", completed);
                var top = false;
                try {
                    top = window.frameElement == null && document.documentElement;
                } catch (e) {
                }
                if (top && top.doScroll) {
                    (function doScrollCheck() {
                        if (!jQuery.isReady) {
                            try {
                                top.doScroll("left");
                            } catch (e) {
                                return setTimeout(doScrollCheck, 50);
                            }
                            detach();
                            jQuery.ready();
                        }
                    })();
                }
            }
        }
        return readyList.promise(obj);
    };
    var strundefined = typeof undefined;
    var i;
    for (i in jQuery(support)) {
        break;
    }
    support.ownLast = i !== "0";
    support.inlineBlockNeedsLayout = false;
    jQuery(function () {
        var val, div, body, container;
        body = document.getElementsByTagName("body")[0];
        if (!body || !body.style) {
            return;
        }
        div = document.createElement("div");
        container = document.createElement("div");
        container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
        body.appendChild(container).appendChild(div);
        if (typeof div.style.zoom !== strundefined) {
            div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";
            support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
            if (val) {
                body.style.zoom = 1;
            }
        }
        body.removeChild(container);
    });
    (function () {
        var div = document.createElement("div");
        if (support.deleteExpando == null) {
            support.deleteExpando = true;
            try {
                delete div.test;
            } catch (e) {
                support.deleteExpando = false;
            }
        }
        div = null;
    })();
    jQuery.acceptData = function (elem) {
        var noData = jQuery.noData[(elem.nodeName + " ").toLowerCase()], nodeType = +elem.nodeType || 1;
        return nodeType !== 1 && nodeType !== 9 ? false : !noData || noData !== true && elem.getAttribute("classid") === noData;
    };
    var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /([A-Z])/g;

    function dataAttr(elem, key, data) {
        if (data === undefined && elem.nodeType === 1) {
            var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
            data = elem.getAttribute(name);
            if (typeof data === "string") {
                try {
                    data = data === "true" ? true : data === "false" ? false : data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
                } catch (e) {
                }
                jQuery.data(elem, key, data);
            } else {
                data = undefined;
            }
        }
        return data;
    }

    function isEmptyDataObject(obj) {
        var name;
        for (name in obj) {
            if (name === "data" && jQuery.isEmptyObject(obj[name])) {
                continue;
            }
            if (name !== "toJSON") {
                return false;
            }
        }
        return true;
    }

    function internalData(elem, name, data, pvt) {
        if (!jQuery.acceptData(elem)) {
            return;
        }
        var ret, thisCache, internalKey = jQuery.expando, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem,
            id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
        if ((!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string") {
            return;
        }
        if (!id) {
            if (isNode) {
                id = elem[internalKey] = deletedIds.pop() || jQuery.guid++;
            } else {
                id = internalKey;
            }
        }
        if (!cache[id]) {
            cache[id] = isNode ? {} : {toJSON: jQuery.noop};
        }
        if (typeof name === "object" || typeof name === "function") {
            if (pvt) {
                cache[id] = jQuery.extend(cache[id], name);
            } else {
                cache[id].data = jQuery.extend(cache[id].data, name);
            }
        }
        thisCache = cache[id];
        if (!pvt) {
            if (!thisCache.data) {
                thisCache.data = {};
            }
            thisCache = thisCache.data;
        }
        if (data !== undefined) {
            thisCache[jQuery.camelCase(name)] = data;
        }
        if (typeof name === "string") {
            ret = thisCache[name];
            if (ret == null) {
                ret = thisCache[jQuery.camelCase(name)];
            }
        } else {
            ret = thisCache;
        }
        return ret;
    }

    function internalRemoveData(elem, name, pvt) {
        if (!jQuery.acceptData(elem)) {
            return;
        }
        var thisCache, i, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem,
            id = isNode ? elem[jQuery.expando] : jQuery.expando;
        if (!cache[id]) {
            return;
        }
        if (name) {
            thisCache = pvt ? cache[id] : cache[id].data;
            if (thisCache) {
                if (!jQuery.isArray(name)) {
                    if (name in thisCache) {
                        name = [name];
                    } else {
                        name = jQuery.camelCase(name);
                        if (name in thisCache) {
                            name = [name];
                        } else {
                            name = name.split(" ");
                        }
                    }
                } else {
                    name = name.concat(jQuery.map(name, jQuery.camelCase));
                }
                i = name.length;
                while (i--) {
                    delete thisCache[name[i]];
                }
                if (pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache)) {
                    return;
                }
            }
        }
        if (!pvt) {
            delete cache[id].data;
            if (!isEmptyDataObject(cache[id])) {
                return;
            }
        }
        if (isNode) {
            jQuery.cleanData([elem], true);
        } else if (support.deleteExpando || cache != cache.window) {
            delete cache[id];
        } else {
            cache[id] = null;
        }
    }

    jQuery.extend({
        cache: {},
        noData: {"applet ": true, "embed ": true, "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},
        hasData: function (elem) {
            elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
            return !!elem && !isEmptyDataObject(elem);
        },
        data: function (elem, name, data) {
            return internalData(elem, name, data);
        },
        removeData: function (elem, name) {
            return internalRemoveData(elem, name);
        },
        _data: function (elem, name, data) {
            return internalData(elem, name, data, true);
        },
        _removeData: function (elem, name) {
            return internalRemoveData(elem, name, true);
        }
    });
    jQuery.fn.extend({
        data: function (key, value) {
            var i, name, data, elem = this[0], attrs = elem && elem.attributes;
            if (key === undefined) {
                if (this.length) {
                    data = jQuery.data(elem);
                    if (elem.nodeType === 1 && !jQuery._data(elem, "parsedAttrs")) {
                        i = attrs.length;
                        while (i--) {
                            if (attrs[i]) {
                                name = attrs[i].name;
                                if (name.indexOf("data-") === 0) {
                                    name = jQuery.camelCase(name.slice(5));
                                    dataAttr(elem, name, data[name]);
                                }
                            }
                        }
                        jQuery._data(elem, "parsedAttrs", true);
                    }
                }
                return data;
            }
            if (typeof key === "object") {
                return this.each(function () {
                    jQuery.data(this, key);
                });
            }
            return arguments.length > 1 ? this.each(function () {
                jQuery.data(this, key, value);
            }) : elem ? dataAttr(elem, key, jQuery.data(elem, key)) : undefined;
        }, removeData: function (key) {
            return this.each(function () {
                jQuery.removeData(this, key);
            });
        }
    });
    jQuery.extend({
        queue: function (elem, type, data) {
            var queue;
            if (elem) {
                type = (type || "fx") + "queue";
                queue = jQuery._data(elem, type);
                if (data) {
                    if (!queue || jQuery.isArray(data)) {
                        queue = jQuery._data(elem, type, jQuery.makeArray(data));
                    } else {
                        queue.push(data);
                    }
                }
                return queue || [];
            }
        }, dequeue: function (elem, type) {
            type = type || "fx";
            var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(),
                hooks = jQuery._queueHooks(elem, type), next = function () {
                    jQuery.dequeue(elem, type);
                };
            if (fn === "inprogress") {
                fn = queue.shift();
                startLength--;
            }
            if (fn) {
                if (type === "fx") {
                    queue.unshift("inprogress");
                }
                delete hooks.stop;
                fn.call(elem, next, hooks);
            }
            if (!startLength && hooks) {
                hooks.empty.fire();
            }
        }, _queueHooks: function (elem, type) {
            var key = type + "queueHooks";
            return jQuery._data(elem, key) || jQuery._data(elem, key, {
                empty: jQuery.Callbacks("once memory").add(function () {
                    jQuery._removeData(elem, type + "queue");
                    jQuery._removeData(elem, key);
                })
            });
        }
    });
    jQuery.fn.extend({
        queue: function (type, data) {
            var setter = 2;
            if (typeof type !== "string") {
                data = type;
                type = "fx";
                setter--;
            }
            if (arguments.length < setter) {
                return jQuery.queue(this[0], type);
            }
            return data === undefined ? this : this.each(function () {
                var queue = jQuery.queue(this, type, data);
                jQuery._queueHooks(this, type);
                if (type === "fx" && queue[0] !== "inprogress") {
                    jQuery.dequeue(this, type);
                }
            });
        }, dequeue: function (type) {
            return this.each(function () {
                jQuery.dequeue(this, type);
            });
        }, clearQueue: function (type) {
            return this.queue(type || "fx", []);
        }, promise: function (type, obj) {
            var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function () {
                if (!(--count)) {
                    defer.resolveWith(elements, [elements]);
                }
            };
            if (typeof type !== "string") {
                obj = type;
                type = undefined;
            }
            type = type || "fx";
            while (i--) {
                tmp = jQuery._data(elements[i], type + "queueHooks");
                if (tmp && tmp.empty) {
                    count++;
                    tmp.empty.add(resolve);
                }
            }
            resolve();
            return defer.promise(obj);
        }
    });
    var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;
    var cssExpand = ["Top", "Right", "Bottom", "Left"];
    var isHidden = function (elem, el) {
        elem = el || elem;
        return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem);
    };
    var access = jQuery.access = function (elems, fn, key, value, chainable, emptyGet, raw) {
        var i = 0, length = elems.length, bulk = key == null;
        if (jQuery.type(key) === "object") {
            chainable = true;
            for (i in key) {
                jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
            }
        } else if (value !== undefined) {
            chainable = true;
            if (!jQuery.isFunction(value)) {
                raw = true;
            }
            if (bulk) {
                if (raw) {
                    fn.call(elems, value);
                    fn = null;
                } else {
                    bulk = fn;
                    fn = function (elem, key, value) {
                        return bulk.call(jQuery(elem), value);
                    };
                }
            }
            if (fn) {
                for (; i < length; i++) {
                    fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                }
            }
        }
        return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
    };
    var rcheckableType = (/^(?:checkbox|radio)$/i);
    (function () {
        var input = document.createElement("input"), div = document.createElement("div"),
            fragment = document.createDocumentFragment();
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        support.leadingWhitespace = div.firstChild.nodeType === 3;
        support.tbody = !div.getElementsByTagName("tbody").length;
        support.htmlSerialize = !!div.getElementsByTagName("link").length;
        support.html5Clone = document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>";
        input.type = "checkbox";
        input.checked = true;
        fragment.appendChild(input);
        support.appendChecked = input.checked;
        div.innerHTML = "<textarea>x</textarea>";
        support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
        fragment.appendChild(div);
        div.innerHTML = "<input type='radio' checked='checked' name='t'/>";
        support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
        support.noCloneEvent = true;
        if (div.attachEvent) {
            div.attachEvent("onclick", function () {
                support.noCloneEvent = false;
            });
            div.cloneNode(true).click();
        }
        if (support.deleteExpando == null) {
            support.deleteExpando = true;
            try {
                delete div.test;
            } catch (e) {
                support.deleteExpando = false;
            }
        }
    })();
    (function () {
        var i, eventName, div = document.createElement("div");
        for (i in{submit: true, change: true, focusin: true}) {
            eventName = "on" + i;
            if (!(support[i + "Bubbles"] = eventName in window)) {
                div.setAttribute(eventName, "t");
                support[i + "Bubbles"] = div.attributes[eventName].expando === false;
            }
        }
        div = null;
    })();
    var rformElems = /^(?:input|select|textarea)$/i, rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/, rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    function safeActiveElement() {
        try {
            return document.activeElement;
        } catch (err) {
        }
    }

    jQuery.event = {
        global: {},
        add: function (elem, types, handler, data, selector) {
            var tmp, events, t, handleObjIn, special, eventHandle, handleObj, handlers, type, namespaces, origType,
                elemData = jQuery._data(elem);
            if (!elemData) {
                return;
            }
            if (handler.handler) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }
            if (!handler.guid) {
                handler.guid = jQuery.guid++;
            }
            if (!(events = elemData.events)) {
                events = elemData.events = {};
            }
            if (!(eventHandle = elemData.handle)) {
                eventHandle = elemData.handle = function (e) {
                    return typeof jQuery !== strundefined && (!e || jQuery.event.triggered !== e.type) ? jQuery.event.dispatch.apply(eventHandle.elem, arguments) : undefined;
                };
                eventHandle.elem = elem;
            }
            types = (types || "").match(rnotwhite) || [""];
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || "").split(".").sort();
                if (!type) {
                    continue;
                }
                special = jQuery.event.special[type] || {};
                type = (selector ? special.delegateType : special.bindType) || type;
                special = jQuery.event.special[type] || {};
                handleObj = jQuery.extend({
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                    namespace: namespaces.join(".")
                }, handleObjIn);
                if (!(handlers = events[type])) {
                    handlers = events[type] = [];
                    handlers.delegateCount = 0;
                    if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                        if (elem.addEventListener) {
                            elem.addEventListener(type, eventHandle, false);
                        } else if (elem.attachEvent) {
                            elem.attachEvent("on" + type, eventHandle);
                        }
                    }
                }
                if (special.add) {
                    special.add.call(elem, handleObj);
                    if (!handleObj.handler.guid) {
                        handleObj.handler.guid = handler.guid;
                    }
                }
                if (selector) {
                    handlers.splice(handlers.delegateCount++, 0, handleObj);
                } else {
                    handlers.push(handleObj);
                }
                jQuery.event.global[type] = true;
            }
            elem = null;
        },
        remove: function (elem, types, handler, selector, mappedTypes) {
            var j, handleObj, tmp, origCount, t, events, special, handlers, type, namespaces, origType,
                elemData = jQuery.hasData(elem) && jQuery._data(elem);
            if (!elemData || !(events = elemData.events)) {
                return;
            }
            types = (types || "").match(rnotwhite) || [""];
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || "").split(".").sort();
                if (!type) {
                    for (type in events) {
                        jQuery.event.remove(elem, type + types[t], handler, selector, true);
                    }
                    continue;
                }
                special = jQuery.event.special[type] || {};
                type = (selector ? special.delegateType : special.bindType) || type;
                handlers = events[type] || [];
                tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
                origCount = j = handlers.length;
                while (j--) {
                    handleObj = handlers[j];
                    if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                        handlers.splice(j, 1);
                        if (handleObj.selector) {
                            handlers.delegateCount--;
                        }
                        if (special.remove) {
                            special.remove.call(elem, handleObj);
                        }
                    }
                }
                if (origCount && !handlers.length) {
                    if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                        jQuery.removeEvent(elem, type, elemData.handle);
                    }
                    delete events[type];
                }
            }
            if (jQuery.isEmptyObject(events)) {
                delete elemData.handle;
                jQuery._removeData(elem, "events");
            }
        },
        trigger: function (event, data, elem, onlyHandlers) {
            var handle, ontype, cur, bubbleType, special, tmp, i, eventPath = [elem || document],
                type = hasOwn.call(event, "type") ? event.type : event,
                namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
            cur = tmp = elem = elem || document;
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }
            if (rfocusMorph.test(type + jQuery.event.triggered)) {
                return;
            }
            if (type.indexOf(".") >= 0) {
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }
            ontype = type.indexOf(":") < 0 && "on" + type;
            event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            event.result = undefined;
            if (!event.target) {
                event.target = elem;
            }
            data = data == null ? [event] : jQuery.makeArray(data, [event]);
            special = jQuery.event.special[type] || {};
            if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
                return;
            }
            if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
                bubbleType = special.delegateType || type;
                if (!rfocusMorph.test(bubbleType + type)) {
                    cur = cur.parentNode;
                }
                for (; cur; cur = cur.parentNode) {
                    eventPath.push(cur);
                    tmp = cur;
                }
                if (tmp === (elem.ownerDocument || document)) {
                    eventPath.push(tmp.defaultView || tmp.parentWindow || window);
                }
            }
            i = 0;
            while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
                event.type = i > 1 ? bubbleType : special.bindType || type;
                handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
                if (handle) {
                    handle.apply(cur, data);
                }
                handle = ontype && cur[ontype];
                if (handle && handle.apply && jQuery.acceptData(cur)) {
                    event.result = handle.apply(cur, data);
                    if (event.result === false) {
                        event.preventDefault();
                    }
                }
            }
            event.type = type;
            if (!onlyHandlers && !event.isDefaultPrevented()) {
                if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && jQuery.acceptData(elem)) {
                    if (ontype && elem[type] && !jQuery.isWindow(elem)) {
                        tmp = elem[ontype];
                        if (tmp) {
                            elem[ontype] = null;
                        }
                        jQuery.event.triggered = type;
                        try {
                            elem[type]();
                        } catch (e) {
                        }
                        jQuery.event.triggered = undefined;
                        if (tmp) {
                            elem[ontype] = tmp;
                        }
                    }
                }
            }
            return event.result;
        },
        dispatch: function (event) {
            event = jQuery.event.fix(event);
            var i, ret, handleObj, matched, j, handlerQueue = [], args = slice.call(arguments),
                handlers = (jQuery._data(this, "events") || {})[event.type] || [],
                special = jQuery.event.special[event.type] || {};
            args[0] = event;
            event.delegateTarget = this;
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
                return;
            }
            handlerQueue = jQuery.event.handlers.call(this, event, handlers);
            i = 0;
            while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
                event.currentTarget = matched.elem;
                j = 0;
                while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
                    if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {
                        event.handleObj = handleObj;
                        event.data = handleObj.data;
                        ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                        if (ret !== undefined) {
                            if ((event.result = ret) === false) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }
            if (special.postDispatch) {
                special.postDispatch.call(this, event);
            }
            return event.result;
        },
        handlers: function (event, handlers) {
            var sel, handleObj, matches, i, handlerQueue = [], delegateCount = handlers.delegateCount,
                cur = event.target;
            if (delegateCount && cur.nodeType && (!event.button || event.type !== "click")) {
                for (; cur != this; cur = cur.parentNode || this) {
                    if (cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click")) {
                        matches = [];
                        for (i = 0; i < delegateCount; i++) {
                            handleObj = handlers[i];
                            sel = handleObj.selector + " ";
                            if (matches[sel] === undefined) {
                                matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [cur]).length;
                            }
                            if (matches[sel]) {
                                matches.push(handleObj);
                            }
                        }
                        if (matches.length) {
                            handlerQueue.push({elem: cur, handlers: matches});
                        }
                    }
                }
            }
            if (delegateCount < handlers.length) {
                handlerQueue.push({elem: this, handlers: handlers.slice(delegateCount)});
            }
            return handlerQueue;
        },
        fix: function (event) {
            if (event[jQuery.expando]) {
                return event;
            }
            var i, prop, copy, type = event.type, originalEvent = event, fixHook = this.fixHooks[type];
            if (!fixHook) {
                this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {};
            }
            copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
            event = new jQuery.Event(originalEvent);
            i = copy.length;
            while (i--) {
                prop = copy[i];
                event[prop] = originalEvent[prop];
            }
            if (!event.target) {
                event.target = originalEvent.srcElement || document;
            }
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }
            event.metaKey = !!event.metaKey;
            return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "), filter: function (event, original) {
                if (event.which == null) {
                    event.which = original.charCode != null ? original.charCode : original.keyCode;
                }
                return event;
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (event, original) {
                var body, eventDoc, doc, button = original.button, fromElement = original.fromElement;
                if (event.pageX == null && original.clientX != null) {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;
                    event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                    event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                }
                if (!event.relatedTarget && fromElement) {
                    event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                }
                if (!event.which && button !== undefined) {
                    event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
                }
                return event;
            }
        },
        special: {
            load: {noBubble: true}, focus: {
                trigger: function () {
                    if (this !== safeActiveElement() && this.focus) {
                        try {
                            this.focus();
                            return false;
                        } catch (e) {
                        }
                    }
                }, delegateType: "focusin"
            }, blur: {
                trigger: function () {
                    if (this === safeActiveElement() && this.blur) {
                        this.blur();
                        return false;
                    }
                }, delegateType: "focusout"
            }, click: {
                trigger: function () {
                    if (jQuery.nodeName(this, "input") && this.type === "checkbox" && this.click) {
                        this.click();
                        return false;
                    }
                }, _default: function (event) {
                    return jQuery.nodeName(event.target, "a");
                }
            }, beforeunload: {
                postDispatch: function (event) {
                    if (event.result !== undefined && event.originalEvent) {
                        event.originalEvent.returnValue = event.result;
                    }
                }
            }
        },
        simulate: function (type, elem, event, bubble) {
            var e = jQuery.extend(new jQuery.Event(), event, {type: type, isSimulated: true, originalEvent: {}});
            if (bubble) {
                jQuery.event.trigger(e, null, elem);
            } else {
                jQuery.event.dispatch.call(elem, e);
            }
            if (e.isDefaultPrevented()) {
                event.preventDefault();
            }
        }
    };
    jQuery.removeEvent = document.removeEventListener ? function (elem, type, handle) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handle, false);
        }
    } : function (elem, type, handle) {
        var name = "on" + type;
        if (elem.detachEvent) {
            if (typeof elem[name] === strundefined) {
                elem[name] = null;
            }
            elem.detachEvent(name, handle);
        }
    };
    jQuery.Event = function (src, props) {
        if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
        }
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined && src.returnValue === false ? returnTrue : returnFalse;
        } else {
            this.type = src;
        }
        if (props) {
            jQuery.extend(this, props);
        }
        this.timeStamp = src && src.timeStamp || jQuery.now();
        this[jQuery.expando] = true;
    };
    jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        preventDefault: function () {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue;
            if (!e) {
                return;
            }
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function () {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue;
            if (!e) {
                return;
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function () {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = returnTrue;
            if (e && e.stopImmediatePropagation) {
                e.stopImmediatePropagation();
            }
            this.stopPropagation();
        }
    };
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function (orig, fix) {
        jQuery.event.special[orig] = {
            delegateType: fix, bindType: fix, handle: function (event) {
                var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
                if (!related || (related !== target && !jQuery.contains(target, related))) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply(this, arguments);
                    event.type = fix;
                }
                return ret;
            }
        };
    });
    if (!support.submitBubbles) {
        jQuery.event.special.submit = {
            setup: function () {
                if (jQuery.nodeName(this, "form")) {
                    return false;
                }
                jQuery.event.add(this, "click._submit keypress._submit", function (e) {
                    var elem = e.target,
                        form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
                    if (form && !jQuery._data(form, "submitBubbles")) {
                        jQuery.event.add(form, "submit._submit", function (event) {
                            event._submit_bubble = true;
                        });
                        jQuery._data(form, "submitBubbles", true);
                    }
                });
            }, postDispatch: function (event) {
                if (event._submit_bubble) {
                    delete event._submit_bubble;
                    if (this.parentNode && !event.isTrigger) {
                        jQuery.event.simulate("submit", this.parentNode, event, true);
                    }
                }
            }, teardown: function () {
                if (jQuery.nodeName(this, "form")) {
                    return false;
                }
                jQuery.event.remove(this, "._submit");
            }
        };
    }
    if (!support.changeBubbles) {
        jQuery.event.special.change = {
            setup: function () {
                if (rformElems.test(this.nodeName)) {
                    if (this.type === "checkbox" || this.type === "radio") {
                        jQuery.event.add(this, "propertychange._change", function (event) {
                            if (event.originalEvent.propertyName === "checked") {
                                this._just_changed = true;
                            }
                        });
                        jQuery.event.add(this, "click._change", function (event) {
                            if (this._just_changed && !event.isTrigger) {
                                this._just_changed = false;
                            }
                            jQuery.event.simulate("change", this, event, true);
                        });
                    }
                    return false;
                }
                jQuery.event.add(this, "beforeactivate._change", function (e) {
                    var elem = e.target;
                    if (rformElems.test(elem.nodeName) && !jQuery._data(elem, "changeBubbles")) {
                        jQuery.event.add(elem, "change._change", function (event) {
                            if (this.parentNode && !event.isSimulated && !event.isTrigger) {
                                jQuery.event.simulate("change", this.parentNode, event, true);
                            }
                        });
                        jQuery._data(elem, "changeBubbles", true);
                    }
                });
            }, handle: function (event) {
                var elem = event.target;
                if (this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox")) {
                    return event.handleObj.handler.apply(this, arguments);
                }
            }, teardown: function () {
                jQuery.event.remove(this, "._change");
                return !rformElems.test(this.nodeName);
            }
        };
    }
    if (!support.focusinBubbles) {
        jQuery.each({focus: "focusin", blur: "focusout"}, function (orig, fix) {
            var handler = function (event) {
                jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
            };
            jQuery.event.special[fix] = {
                setup: function () {
                    var doc = this.ownerDocument || this, attaches = jQuery._data(doc, fix);
                    if (!attaches) {
                        doc.addEventListener(orig, handler, true);
                    }
                    jQuery._data(doc, fix, (attaches || 0) + 1);
                }, teardown: function () {
                    var doc = this.ownerDocument || this, attaches = jQuery._data(doc, fix) - 1;
                    if (!attaches) {
                        doc.removeEventListener(orig, handler, true);
                        jQuery._removeData(doc, fix);
                    } else {
                        jQuery._data(doc, fix, attaches);
                    }
                }
            };
        });
    }
    jQuery.fn.extend({
        on: function (types, selector, data, fn, one) {
            var type, origFn;
            if (typeof types === "object") {
                if (typeof selector !== "string") {
                    data = data || selector;
                    selector = undefined;
                }
                for (type in types) {
                    this.on(type, selector, data, types[type], one);
                }
                return this;
            }
            if (data == null && fn == null) {
                fn = selector;
                data = selector = undefined;
            } else if (fn == null) {
                if (typeof selector === "string") {
                    fn = data;
                    data = undefined;
                } else {
                    fn = data;
                    data = selector;
                    selector = undefined;
                }
            }
            if (fn === false) {
                fn = returnFalse;
            } else if (!fn) {
                return this;
            }
            if (one === 1) {
                origFn = fn;
                fn = function (event) {
                    jQuery().off(event);
                    return origFn.apply(this, arguments);
                };
                fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
            }
            return this.each(function () {
                jQuery.event.add(this, types, fn, data, selector);
            });
        }, one: function (types, selector, data, fn) {
            return this.on(types, selector, data, fn, 1);
        }, off: function (types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {
                handleObj = types.handleObj;
                jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
                return this;
            }
            if (typeof types === "object") {
                for (type in types) {
                    this.off(type, selector, types[type]);
                }
                return this;
            }
            if (selector === false || typeof selector === "function") {
                fn = selector;
                selector = undefined;
            }
            if (fn === false) {
                fn = returnFalse;
            }
            return this.each(function () {
                jQuery.event.remove(this, types, fn, selector);
            });
        }, trigger: function (type, data) {
            return this.each(function () {
                jQuery.event.trigger(type, data, this);
            });
        }, triggerHandler: function (type, data) {
            var elem = this[0];
            if (elem) {
                return jQuery.event.trigger(type, data, elem, true);
            }
        }
    });

    function createSafeFragment(document) {
        var list = nodeNames.split("|"), safeFrag = document.createDocumentFragment();
        if (safeFrag.createElement) {
            while (list.length) {
                safeFrag.createElement(list.pop());
            }
        }
        return safeFrag;
    }

    var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" + "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g, rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
        rleadingWhitespace = /^\s+/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rtagName = /<([\w:]+)/,
        rtbody = /<tbody/i, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style|link)/i,
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /^$|\/(?:java|ecma)script/i,
        rscriptTypeMasked = /^true\/(.*)/, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, wrapMap = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        }, safeFragment = createSafeFragment(document),
        fragmentDiv = safeFragment.appendChild(document.createElement("div"));
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    function getAll(context, tag) {
        var elems, elem, i = 0,
            found = typeof context.getElementsByTagName !== strundefined ? context.getElementsByTagName(tag || "*") : typeof context.querySelectorAll !== strundefined ? context.querySelectorAll(tag || "*") : undefined;
        if (!found) {
            for (found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++) {
                if (!tag || jQuery.nodeName(elem, tag)) {
                    found.push(elem);
                } else {
                    jQuery.merge(found, getAll(elem, tag));
                }
            }
        }
        return tag === undefined || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], found) : found;
    }

    function fixDefaultChecked(elem) {
        if (rcheckableType.test(elem.type)) {
            elem.defaultChecked = elem.checked;
        }
    }

    function manipulationTarget(elem, content) {
        return jQuery.nodeName(elem, "table") && jQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
    }

    function disableScript(elem) {
        elem.type = (jQuery.find.attr(elem, "type") !== null) + "/" + elem.type;
        return elem;
    }

    function restoreScript(elem) {
        var match = rscriptTypeMasked.exec(elem.type);
        if (match) {
            elem.type = match[1];
        } else {
            elem.removeAttribute("type");
        }
        return elem;
    }

    function setGlobalEval(elems, refElements) {
        var elem, i = 0;
        for (; (elem = elems[i]) != null; i++) {
            jQuery._data(elem, "globalEval", !refElements || jQuery._data(refElements[i], "globalEval"));
        }
    }

    function cloneCopyEvent(src, dest) {
        if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
            return;
        }
        var type, i, l, oldData = jQuery._data(src), curData = jQuery._data(dest, oldData), events = oldData.events;
        if (events) {
            delete curData.handle;
            curData.events = {};
            for (type in events) {
                for (i = 0, l = events[type].length; i < l; i++) {
                    jQuery.event.add(dest, type, events[type][i]);
                }
            }
        }
        if (curData.data) {
            curData.data = jQuery.extend({}, curData.data);
        }
    }

    function fixCloneNodeIssues(src, dest) {
        var nodeName, e, data;
        if (dest.nodeType !== 1) {
            return;
        }
        nodeName = dest.nodeName.toLowerCase();
        if (!support.noCloneEvent && dest[jQuery.expando]) {
            data = jQuery._data(dest);
            for (e in data.events) {
                jQuery.removeEvent(dest, e, data.handle);
            }
            dest.removeAttribute(jQuery.expando);
        }
        if (nodeName === "script" && dest.text !== src.text) {
            disableScript(dest).text = src.text;
            restoreScript(dest);
        } else if (nodeName === "object") {
            if (dest.parentNode) {
                dest.outerHTML = src.outerHTML;
            }
            if (support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML))) {
                dest.innerHTML = src.innerHTML;
            }
        } else if (nodeName === "input" && rcheckableType.test(src.type)) {
            dest.defaultChecked = dest.checked = src.checked;
            if (dest.value !== src.value) {
                dest.value = src.value;
            }
        } else if (nodeName === "option") {
            dest.defaultSelected = dest.selected = src.defaultSelected;
        } else if (nodeName === "input" || nodeName === "textarea") {
            dest.defaultValue = src.defaultValue;
        }
    }

    jQuery.extend({
        clone: function (elem, dataAndEvents, deepDataAndEvents) {
            var destElements, node, clone, i, srcElements, inPage = jQuery.contains(elem.ownerDocument, elem);
            if (support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test("<" + elem.nodeName + ">")) {
                clone = elem.cloneNode(true);
            } else {
                fragmentDiv.innerHTML = elem.outerHTML;
                fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
            }
            if ((!support.noCloneEvent || !support.noCloneChecked) && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
                destElements = getAll(clone);
                srcElements = getAll(elem);
                for (i = 0; (node = srcElements[i]) != null; ++i) {
                    if (destElements[i]) {
                        fixCloneNodeIssues(node, destElements[i]);
                    }
                }
            }
            if (dataAndEvents) {
                if (deepDataAndEvents) {
                    srcElements = srcElements || getAll(elem);
                    destElements = destElements || getAll(clone);
                    for (i = 0; (node = srcElements[i]) != null; i++) {
                        cloneCopyEvent(node, destElements[i]);
                    }
                } else {
                    cloneCopyEvent(elem, clone);
                }
            }
            destElements = getAll(clone, "script");
            if (destElements.length > 0) {
                setGlobalEval(destElements, !inPage && getAll(elem, "script"));
            }
            destElements = srcElements = node = null;
            return clone;
        }, buildFragment: function (elems, context, scripts, selection) {
            var j, elem, contains, tmp, tag, tbody, wrap, l = elems.length, safe = createSafeFragment(context),
                nodes = [], i = 0;
            for (; i < l; i++) {
                elem = elems[i];
                if (elem || elem === 0) {
                    if (jQuery.type(elem) === "object") {
                        jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
                    } else if (!rhtml.test(elem)) {
                        nodes.push(context.createTextNode(elem));
                    } else {
                        tmp = tmp || safe.appendChild(context.createElement("div"));
                        tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                        wrap = wrapMap[tag] || wrapMap._default;
                        tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];
                        j = wrap[0];
                        while (j--) {
                            tmp = tmp.lastChild;
                        }
                        if (!support.leadingWhitespace && rleadingWhitespace.test(elem)) {
                            nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0]));
                        }
                        if (!support.tbody) {
                            elem = tag === "table" && !rtbody.test(elem) ? tmp.firstChild : wrap[1] === "<table>" && !rtbody.test(elem) ? tmp : 0;
                            j = elem && elem.childNodes.length;
                            while (j--) {
                                if (jQuery.nodeName((tbody = elem.childNodes[j]), "tbody") && !tbody.childNodes.length) {
                                    elem.removeChild(tbody);
                                }
                            }
                        }
                        jQuery.merge(nodes, tmp.childNodes);
                        tmp.textContent = "";
                        while (tmp.firstChild) {
                            tmp.removeChild(tmp.firstChild);
                        }
                        tmp = safe.lastChild;
                    }
                }
            }
            if (tmp) {
                safe.removeChild(tmp);
            }
            if (!support.appendChecked) {
                jQuery.grep(getAll(nodes, "input"), fixDefaultChecked);
            }
            i = 0;
            while ((elem = nodes[i++])) {
                if (selection && jQuery.inArray(elem, selection) !== -1) {
                    continue;
                }
                contains = jQuery.contains(elem.ownerDocument, elem);
                tmp = getAll(safe.appendChild(elem), "script");
                if (contains) {
                    setGlobalEval(tmp);
                }
                if (scripts) {
                    j = 0;
                    while ((elem = tmp[j++])) {
                        if (rscriptType.test(elem.type || "")) {
                            scripts.push(elem);
                        }
                    }
                }
            }
            tmp = null;
            return safe;
        }, cleanData: function (elems, acceptData) {
            var elem, type, id, data, i = 0, internalKey = jQuery.expando, cache = jQuery.cache,
                deleteExpando = support.deleteExpando, special = jQuery.event.special;
            for (; (elem = elems[i]) != null; i++) {
                if (acceptData || jQuery.acceptData(elem)) {
                    id = elem[internalKey];
                    data = id && cache[id];
                    if (data) {
                        if (data.events) {
                            for (type in data.events) {
                                if (special[type]) {
                                    jQuery.event.remove(elem, type);
                                } else {
                                    jQuery.removeEvent(elem, type, data.handle);
                                }
                            }
                        }
                        if (cache[id]) {
                            delete cache[id];
                            if (deleteExpando) {
                                delete elem[internalKey];
                            } else if (typeof elem.removeAttribute !== strundefined) {
                                elem.removeAttribute(internalKey);
                            } else {
                                elem[internalKey] = null;
                            }
                            deletedIds.push(id);
                        }
                    }
                }
            }
        }
    });
    jQuery.fn.extend({
        text: function (value) {
            return access(this, function (value) {
                return value === undefined ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
            }, null, value, arguments.length);
        }, append: function () {
            return this.domManip(arguments, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.appendChild(elem);
                }
            });
        }, prepend: function () {
            return this.domManip(arguments, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.insertBefore(elem, target.firstChild);
                }
            });
        }, before: function () {
            return this.domManip(arguments, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this);
                }
            });
        }, after: function () {
            return this.domManip(arguments, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                }
            });
        }, remove: function (selector, keepData) {
            var elem, elems = selector ? jQuery.filter(selector, this) : this, i = 0;
            for (; (elem = elems[i]) != null; i++) {
                if (!keepData && elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem));
                }
                if (elem.parentNode) {
                    if (keepData && jQuery.contains(elem.ownerDocument, elem)) {
                        setGlobalEval(getAll(elem, "script"));
                    }
                    elem.parentNode.removeChild(elem);
                }
            }
            return this;
        }, empty: function () {
            var elem, i = 0;
            for (; (elem = this[i]) != null; i++) {
                if (elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem, false));
                }
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }
                if (elem.options && jQuery.nodeName(elem, "select")) {
                    elem.options.length = 0;
                }
            }
            return this;
        }, clone: function (dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
            return this.map(function () {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        }, html: function (value) {
            return access(this, function (value) {
                var elem = this[0] || {}, i = 0, l = this.length;
                if (value === undefined) {
                    return elem.nodeType === 1 ? elem.innerHTML.replace(rinlinejQuery, "") : undefined;
                }
                if (typeof value === "string" && !rnoInnerhtml.test(value) && (support.htmlSerialize || !rnoshimcache.test(value)) && (support.leadingWhitespace || !rleadingWhitespace.test(value)) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {
                    value = value.replace(rxhtmlTag, "<$1></$2>");
                    try {
                        for (; i < l; i++) {
                            elem = this[i] || {};
                            if (elem.nodeType === 1) {
                                jQuery.cleanData(getAll(elem, false));
                                elem.innerHTML = value;
                            }
                        }
                        elem = 0;
                    } catch (e) {
                    }
                }
                if (elem) {
                    this.empty().append(value);
                }
            }, null, value, arguments.length);
        }, replaceWith: function () {
            var arg = arguments[0];
            this.domManip(arguments, function (elem) {
                arg = this.parentNode;
                jQuery.cleanData(getAll(this));
                if (arg) {
                    arg.replaceChild(elem, this);
                }
            });
            return arg && (arg.length || arg.nodeType) ? this : this.remove();
        }, detach: function (selector) {
            return this.remove(selector, true);
        }, domManip: function (args, callback) {
            args = concat.apply([], args);
            var first, node, hasScripts, scripts, doc, fragment, i = 0, l = this.length, set = this, iNoClone = l - 1,
                value = args[0], isFunction = jQuery.isFunction(value);
            if (isFunction || (l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value))) {
                return this.each(function (index) {
                    var self = set.eq(index);
                    if (isFunction) {
                        args[0] = value.call(this, index, self.html());
                    }
                    self.domManip(args, callback);
                });
            }
            if (l) {
                fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, this);
                first = fragment.firstChild;
                if (fragment.childNodes.length === 1) {
                    fragment = first;
                }
                if (first) {
                    scripts = jQuery.map(getAll(fragment, "script"), disableScript);
                    hasScripts = scripts.length;
                    for (; i < l; i++) {
                        node = fragment;
                        if (i !== iNoClone) {
                            node = jQuery.clone(node, true, true);
                            if (hasScripts) {
                                jQuery.merge(scripts, getAll(node, "script"));
                            }
                        }
                        callback.call(this[i], node, i);
                    }
                    if (hasScripts) {
                        doc = scripts[scripts.length - 1].ownerDocument;
                        jQuery.map(scripts, restoreScript);
                        for (i = 0; i < hasScripts; i++) {
                            node = scripts[i];
                            if (rscriptType.test(node.type || "") && !jQuery._data(node, "globalEval") && jQuery.contains(doc, node)) {
                                if (node.src) {
                                    if (jQuery._evalUrl) {
                                        jQuery._evalUrl(node.src);
                                    }
                                } else {
                                    jQuery.globalEval((node.text || node.textContent || node.innerHTML || "").replace(rcleanScript, ""));
                                }
                            }
                        }
                    }
                    fragment = first = null;
                }
            }
            return this;
        }
    });
    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (name, original) {
        jQuery.fn[name] = function (selector) {
            var elems, i = 0, ret = [], insert = jQuery(selector), last = insert.length - 1;
            for (; i <= last; i++) {
                elems = i === last ? this : this.clone(true);
                jQuery(insert[i])[original](elems);
                push.apply(ret, elems.get());
            }
            return this.pushStack(ret);
        };
    });
    var iframe, elemdisplay = {};

    function actualDisplay(name, doc) {
        var style, elem = jQuery(doc.createElement(name)).appendTo(doc.body),
            display = window.getDefaultComputedStyle && (style = window.getDefaultComputedStyle(elem[0])) ? style.display : jQuery.css(elem[0], "display");
        elem.detach();
        return display;
    }

    function defaultDisplay(nodeName) {
        var doc = document, display = elemdisplay[nodeName];
        if (!display) {
            display = actualDisplay(nodeName, doc);
            if (display === "none" || !display) {
                iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement);
                doc = (iframe[0].contentWindow || iframe[0].contentDocument).document;
                doc.write();
                doc.close();
                display = actualDisplay(nodeName, doc);
                iframe.detach();
            }
            elemdisplay[nodeName] = display;
        }
        return display;
    }

    (function () {
        var shrinkWrapBlocksVal;
        support.shrinkWrapBlocks = function () {
            if (shrinkWrapBlocksVal != null) {
                return shrinkWrapBlocksVal;
            }
            shrinkWrapBlocksVal = false;
            var div, body, container;
            body = document.getElementsByTagName("body")[0];
            if (!body || !body.style) {
                return;
            }
            div = document.createElement("div");
            container = document.createElement("div");
            container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
            body.appendChild(container).appendChild(div);
            if (typeof div.style.zoom !== strundefined) {
                div.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" + "box-sizing:content-box;display:block;margin:0;border:0;" + "padding:1px;width:1px;zoom:1";
                div.appendChild(document.createElement("div")).style.width = "5px";
                shrinkWrapBlocksVal = div.offsetWidth !== 3;
            }
            body.removeChild(container);
            return shrinkWrapBlocksVal;
        };
    })();
    var rmargin = (/^margin/);
    var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
    var getStyles, curCSS, rposition = /^(top|right|bottom|left)$/;
    if (window.getComputedStyle) {
        getStyles = function (elem) {
            return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
        };
        curCSS = function (elem, name, computed) {
            var width, minWidth, maxWidth, ret, style = elem.style;
            computed = computed || getStyles(elem);
            ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined;
            if (computed) {
                if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
                    ret = jQuery.style(elem, name);
                }
                if (rnumnonpx.test(ret) && rmargin.test(name)) {
                    width = style.width;
                    minWidth = style.minWidth;
                    maxWidth = style.maxWidth;
                    style.minWidth = style.maxWidth = style.width = ret;
                    ret = computed.width;
                    style.width = width;
                    style.minWidth = minWidth;
                    style.maxWidth = maxWidth;
                }
            }
            return ret === undefined ? ret : ret + "";
        };
    } else if (document.documentElement.currentStyle) {
        getStyles = function (elem) {
            return elem.currentStyle;
        };
        curCSS = function (elem, name, computed) {
            var left, rs, rsLeft, ret, style = elem.style;
            computed = computed || getStyles(elem);
            ret = computed ? computed[name] : undefined;
            if (ret == null && style && style[name]) {
                ret = style[name];
            }
            if (rnumnonpx.test(ret) && !rposition.test(name)) {
                left = style.left;
                rs = elem.runtimeStyle;
                rsLeft = rs && rs.left;
                if (rsLeft) {
                    rs.left = elem.currentStyle.left;
                }
                style.left = name === "fontSize" ? "1em" : ret;
                ret = style.pixelLeft + "px";
                style.left = left;
                if (rsLeft) {
                    rs.left = rsLeft;
                }
            }
            return ret === undefined ? ret : ret + "" || "auto";
        };
    }

    function addGetHookIf(conditionFn, hookFn) {
        return {
            get: function () {
                var condition = conditionFn();
                if (condition == null) {
                    return;
                }
                if (condition) {
                    delete this.get;
                    return;
                }
                return (this.get = hookFn).apply(this, arguments);
            }
        };
    }

    (function () {
        var div, style, a, pixelPositionVal, boxSizingReliableVal, reliableHiddenOffsetsVal, reliableMarginRightVal;
        div = document.createElement("div");
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        a = div.getElementsByTagName("a")[0];
        style = a && a.style;
        if (!style) {
            return;
        }
        style.cssText = "float:left;opacity:.5";
        support.opacity = style.opacity === "0.5";
        support.cssFloat = !!style.cssFloat;
        div.style.backgroundClip = "content-box";
        div.cloneNode(true).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";
        support.boxSizing = style.boxSizing === "" || style.MozBoxSizing === "" || style.WebkitBoxSizing === "";
        jQuery.extend(support, {
            reliableHiddenOffsets: function () {
                if (reliableHiddenOffsetsVal == null) {
                    computeStyleTests();
                }
                return reliableHiddenOffsetsVal;
            }, boxSizingReliable: function () {
                if (boxSizingReliableVal == null) {
                    computeStyleTests();
                }
                return boxSizingReliableVal;
            }, pixelPosition: function () {
                if (pixelPositionVal == null) {
                    computeStyleTests();
                }
                return pixelPositionVal;
            }, reliableMarginRight: function () {
                if (reliableMarginRightVal == null) {
                    computeStyleTests();
                }
                return reliableMarginRightVal;
            }
        });

        function computeStyleTests() {
            var div, body, container, contents;
            body = document.getElementsByTagName("body")[0];
            if (!body || !body.style) {
                return;
            }
            div = document.createElement("div");
            container = document.createElement("div");
            container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
            body.appendChild(container).appendChild(div);
            div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" + "box-sizing:border-box;display:block;margin-top:1%;top:1%;" + "border:1px;padding:1px;width:4px;position:absolute";
            pixelPositionVal = boxSizingReliableVal = false;
            reliableMarginRightVal = true;
            if (window.getComputedStyle) {
                pixelPositionVal = (window.getComputedStyle(div, null) || {}).top !== "1%";
                boxSizingReliableVal = (window.getComputedStyle(div, null) || {width: "4px"}).width === "4px";
                contents = div.appendChild(document.createElement("div"));
                contents.style.cssText = div.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" + "box-sizing:content-box;display:block;margin:0;border:0;padding:0";
                contents.style.marginRight = contents.style.width = "0";
                div.style.width = "1px";
                reliableMarginRightVal = !parseFloat((window.getComputedStyle(contents, null) || {}).marginRight);
            }
            div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
            contents = div.getElementsByTagName("td");
            contents[0].style.cssText = "margin:0;border:0;padding:0;display:none";
            reliableHiddenOffsetsVal = contents[0].offsetHeight === 0;
            if (reliableHiddenOffsetsVal) {
                contents[0].style.display = "";
                contents[1].style.display = "none";
                reliableHiddenOffsetsVal = contents[0].offsetHeight === 0;
            }
            body.removeChild(container);
        }
    })();
    jQuery.swap = function (elem, options, callback, args) {
        var ret, name, old = {};
        for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
        }
        ret = callback.apply(elem, args || []);
        for (name in options) {
            elem.style[name] = old[name];
        }
        return ret;
    };
    var
        ralpha = /alpha\([^)]*\)/i, ropacity = /opacity\s*=\s*([^)]*)/, rdisplayswap = /^(none|table(?!-c[ea]).+)/,
        rnumsplit = new RegExp("^(" + pnum + ")(.*)$", "i"), rrelNum = new RegExp("^([+-])=(" + pnum + ")", "i"),
        cssShow = {position: "absolute", visibility: "hidden", display: "block"},
        cssNormalTransform = {letterSpacing: "0", fontWeight: "400"}, cssPrefixes = ["Webkit", "O", "Moz", "ms"];

    function vendorPropName(style, name) {
        if (name in style) {
            return name;
        }
        var capName = name.charAt(0).toUpperCase() + name.slice(1), origName = name, i = cssPrefixes.length;
        while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in style) {
                return name;
            }
        }
        return origName;
    }

    function showHide(elements, show) {
        var display, elem, hidden, values = [], index = 0, length = elements.length;
        for (; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }
            values[index] = jQuery._data(elem, "olddisplay");
            display = elem.style.display;
            if (show) {
                if (!values[index] && display === "none") {
                    elem.style.display = "";
                }
                if (elem.style.display === "" && isHidden(elem)) {
                    values[index] = jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
                }
            } else {
                hidden = isHidden(elem);
                if (display && display !== "none" || !hidden) {
                    jQuery._data(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
                }
            }
        }
        for (index = 0; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }
            if (!show || elem.style.display === "none" || elem.style.display === "") {
                elem.style.display = show ? values[index] || "" : "none";
            }
        }
        return elements;
    }

    function setPositiveNumber(elem, value, subtract) {
        var matches = rnumsplit.exec(value);
        return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") : value;
    }

    function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
        var i = extra === (isBorderBox ? "border" : "content") ? 4 : name === "width" ? 1 : 0, val = 0;
        for (; i < 4; i += 2) {
            if (extra === "margin") {
                val += jQuery.css(elem, extra + cssExpand[i], true, styles);
            }
            if (isBorderBox) {
                if (extra === "content") {
                    val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
                }
                if (extra !== "margin") {
                    val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
                }
            } else {
                val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
                if (extra !== "padding") {
                    val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
                }
            }
        }
        return val;
    }

    function getWidthOrHeight(elem, name, extra) {
        var valueIsBorderBox = true, val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
            styles = getStyles(elem),
            isBorderBox = support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box";
        if (val <= 0 || val == null) {
            val = curCSS(elem, name, styles);
            if (val < 0 || val == null) {
                val = elem.style[name];
            }
            if (rnumnonpx.test(val)) {
                return val;
            }
            valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);
            val = parseFloat(val) || 0;
        }
        return (val +
            augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles)) + "px";
    }

    jQuery.extend({
        cssHooks: {
            opacity: {
                get: function (elem, computed) {
                    if (computed) {
                        var ret = curCSS(elem, "opacity");
                        return ret === "" ? "1" : ret;
                    }
                }
            }
        },
        cssNumber: {
            "columnCount": true,
            "fillOpacity": true,
            "flexGrow": true,
            "flexShrink": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "order": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },
        cssProps: {"float": support.cssFloat ? "cssFloat" : "styleFloat"},
        style: function (elem, name, value, extra) {
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }
            var ret, type, hooks, origName = jQuery.camelCase(name), style = elem.style;
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName));
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (value !== undefined) {
                type = typeof value;
                if (type === "string" && (ret = rrelNum.exec(value))) {
                    value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
                    type = "number";
                }
                if (value == null || value !== value) {
                    return;
                }
                if (type === "number" && !jQuery.cssNumber[origName]) {
                    value += "px";
                }
                if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
                    style[name] = "inherit";
                }
                if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
                    try {
                        style[name] = value;
                    } catch (e) {
                    }
                }
            } else {
                if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                    return ret;
                }
                return style[name];
            }
        },
        css: function (elem, name, extra, styles) {
            var num, val, hooks, origName = jQuery.camelCase(name);
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName));
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (hooks && "get" in hooks) {
                val = hooks.get(elem, true, extra);
            }
            if (val === undefined) {
                val = curCSS(elem, name, styles);
            }
            if (val === "normal" && name in cssNormalTransform) {
                val = cssNormalTransform[name];
            }
            if (extra === "" || extra) {
                num = parseFloat(val);
                return extra === true || jQuery.isNumeric(num) ? num || 0 : val;
            }
            return val;
        }
    });
    jQuery.each(["height", "width"], function (i, name) {
        jQuery.cssHooks[name] = {
            get: function (elem, computed, extra) {
                if (computed) {
                    return rdisplayswap.test(jQuery.css(elem, "display")) && elem.offsetWidth === 0 ? jQuery.swap(elem, cssShow, function () {
                        return getWidthOrHeight(elem, name, extra);
                    }) : getWidthOrHeight(elem, name, extra);
                }
            }, set: function (elem, value, extra) {
                var styles = extra && getStyles(elem);
                return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box", styles) : 0);
            }
        };
    });
    if (!support.opacity) {
        jQuery.cssHooks.opacity = {
            get: function (elem, computed) {
                return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? (0.01 * parseFloat(RegExp.$1)) + "" : computed ? "1" : "";
            }, set: function (elem, value) {
                var style = elem.style, currentStyle = elem.currentStyle,
                    opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "",
                    filter = currentStyle && currentStyle.filter || style.filter || "";
                style.zoom = 1;
                if ((value >= 1 || value === "") && jQuery.trim(filter.replace(ralpha, "")) === "" && style.removeAttribute) {
                    style.removeAttribute("filter");
                    if (value === "" || currentStyle && !currentStyle.filter) {
                        return;
                    }
                }
                style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
            }
        };
    }
    jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function (elem, computed) {
        if (computed) {
            return jQuery.swap(elem, {"display": "inline-block"}, curCSS, [elem, "marginRight"]);
        }
    });
    jQuery.each({margin: "", padding: "", border: "Width"}, function (prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function (value) {
                var i = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
                for (; i < 4; i++) {
                    expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
                }
                return expanded;
            }
        };
        if (!rmargin.test(prefix)) {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
    });
    jQuery.fn.extend({
        css: function (name, value) {
            return access(this, function (elem, name, value) {
                var styles, len, map = {}, i = 0;
                if (jQuery.isArray(name)) {
                    styles = getStyles(elem);
                    len = name.length;
                    for (; i < len; i++) {
                        map[name[i]] = jQuery.css(elem, name[i], false, styles);
                    }
                    return map;
                }
                return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
            }, name, value, arguments.length > 1);
        }, show: function () {
            return showHide(this, true);
        }, hide: function () {
            return showHide(this);
        }, toggle: function (state) {
            if (typeof state === "boolean") {
                return state ? this.show() : this.hide();
            }
            return this.each(function () {
                if (isHidden(this)) {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            });
        }
    });

    function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
    }

    jQuery.Tween = Tween;
    Tween.prototype = {
        constructor: Tween, init: function (elem, options, prop, end, easing, unit) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || "swing";
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        }, cur: function () {
            var hooks = Tween.propHooks[this.prop];
            return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
        }, run: function (percent) {
            var eased, hooks = Tween.propHooks[this.prop];
            if (this.options.duration) {
                this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
            } else {
                this.pos = eased = percent;
            }
            this.now = (this.end - this.start) * eased + this.start;
            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this);
            }
            if (hooks && hooks.set) {
                hooks.set(this);
            } else {
                Tween.propHooks._default.set(this);
            }
            return this;
        }
    };
    Tween.prototype.init.prototype = Tween.prototype;
    Tween.propHooks = {
        _default: {
            get: function (tween) {
                var result;
                if (tween.elem[tween.prop] != null && (!tween.elem.style || tween.elem.style[tween.prop] == null)) {
                    return tween.elem[tween.prop];
                }
                result = jQuery.css(tween.elem, tween.prop, "");
                return !result || result === "auto" ? 0 : result;
            }, set: function (tween) {
                if (jQuery.fx.step[tween.prop]) {
                    jQuery.fx.step[tween.prop](tween);
                } else if (tween.elem.style && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
                    jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
                } else {
                    tween.elem[tween.prop] = tween.now;
                }
            }
        }
    };
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function (tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
                tween.elem[tween.prop] = tween.now;
            }
        }
    };
    jQuery.easing = {
        linear: function (p) {
            return p;
        }, swing: function (p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
        }
    };
    jQuery.fx = Tween.prototype.init;
    jQuery.fx.step = {};
    var
        fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/,
        rfxnum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i"), rrun = /queueHooks$/,
        animationPrefilters = [defaultPrefilter], tweeners = {
            "*": [function (prop, value) {
                var tween = this.createTween(prop, value), target = tween.cur(), parts = rfxnum.exec(value),
                    unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px"),
                    start = (jQuery.cssNumber[prop] || unit !== "px" && +target) && rfxnum.exec(jQuery.css(tween.elem, prop)),
                    scale = 1, maxIterations = 20;
                if (start && start[3] !== unit) {
                    unit = unit || start[3];
                    parts = parts || [];
                    start = +target || 1;
                    do {
                        scale = scale || ".5";
                        start = start / scale;
                        jQuery.style(tween.elem, prop, start + unit);
                    } while (scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations);
                }
                if (parts) {
                    start = tween.start = +start || +target || 0;
                    tween.unit = unit;
                    tween.end = parts[1] ? start + (parts[1] + 1) * parts[2] : +parts[2];
                }
                return tween;
            }]
        };

    function createFxNow() {
        setTimeout(function () {
            fxNow = undefined;
        });
        return (fxNow = jQuery.now());
    }

    function genFx(type, includeWidth) {
        var which, attrs = {height: type}, i = 0;
        includeWidth = includeWidth ? 1 : 0;
        for (; i < 4; i += 2 - includeWidth) {
            which = cssExpand[i];
            attrs["margin" + which] = attrs["padding" + which] = type;
        }
        if (includeWidth) {
            attrs.opacity = attrs.width = type;
        }
        return attrs;
    }

    function createTween(value, prop, animation) {
        var tween, collection = (tweeners[prop] || []).concat(tweeners["*"]), index = 0, length = collection.length;
        for (; index < length; index++) {
            if ((tween = collection[index].call(animation, prop, value))) {
                return tween;
            }
        }
    }

    function defaultPrefilter(elem, props, opts) {
        var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay, anim = this, orig = {},
            style = elem.style, hidden = elem.nodeType && isHidden(elem), dataShow = jQuery._data(elem, "fxshow");
        if (!opts.queue) {
            hooks = jQuery._queueHooks(elem, "fx");
            if (hooks.unqueued == null) {
                hooks.unqueued = 0;
                oldfire = hooks.empty.fire;
                hooks.empty.fire = function () {
                    if (!hooks.unqueued) {
                        oldfire();
                    }
                };
            }
            hooks.unqueued++;
            anim.always(function () {
                anim.always(function () {
                    hooks.unqueued--;
                    if (!jQuery.queue(elem, "fx").length) {
                        hooks.empty.fire();
                    }
                });
            });
        }
        if (elem.nodeType === 1 && ("height" in props || "width" in props)) {
            opts.overflow = [style.overflow, style.overflowX, style.overflowY];
            display = jQuery.css(elem, "display");
            checkDisplay = display === "none" ? jQuery._data(elem, "olddisplay") || defaultDisplay(elem.nodeName) : display;
            if (checkDisplay === "inline" && jQuery.css(elem, "float") === "none") {
                if (!support.inlineBlockNeedsLayout || defaultDisplay(elem.nodeName) === "inline") {
                    style.display = "inline-block";
                } else {
                    style.zoom = 1;
                }
            }
        }
        if (opts.overflow) {
            style.overflow = "hidden";
            if (!support.shrinkWrapBlocks()) {
                anim.always(function () {
                    style.overflow = opts.overflow[0];
                    style.overflowX = opts.overflow[1];
                    style.overflowY = opts.overflow[2];
                });
            }
        }
        for (prop in props) {
            value = props[prop];
            if (rfxtypes.exec(value)) {
                delete props[prop];
                toggle = toggle || value === "toggle";
                if (value === (hidden ? "hide" : "show")) {
                    if (value === "show" && dataShow && dataShow[prop] !== undefined) {
                        hidden = true;
                    } else {
                        continue;
                    }
                }
                orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
            } else {
                display = undefined;
            }
        }
        if (!jQuery.isEmptyObject(orig)) {
            if (dataShow) {
                if ("hidden" in dataShow) {
                    hidden = dataShow.hidden;
                }
            } else {
                dataShow = jQuery._data(elem, "fxshow", {});
            }
            if (toggle) {
                dataShow.hidden = !hidden;
            }
            if (hidden) {
                jQuery(elem).show();
            } else {
                anim.done(function () {
                    jQuery(elem).hide();
                });
            }
            anim.done(function () {
                var prop;
                jQuery._removeData(elem, "fxshow");
                for (prop in orig) {
                    jQuery.style(elem, prop, orig[prop]);
                }
            });
            for (prop in orig) {
                tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
                if (!(prop in dataShow)) {
                    dataShow[prop] = tween.start;
                    if (hidden) {
                        tween.end = tween.start;
                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
                    }
                }
            }
        } else if ((display === "none" ? defaultDisplay(elem.nodeName) : display) === "inline") {
            style.display = display;
        }
    }

    function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;
        for (index in props) {
            name = jQuery.camelCase(index);
            easing = specialEasing[name];
            value = props[index];
            if (jQuery.isArray(value)) {
                easing = value[1];
                value = props[index] = value[0];
            }
            if (index !== name) {
                props[name] = value;
                delete props[index];
            }
            hooks = jQuery.cssHooks[name];
            if (hooks && "expand" in hooks) {
                value = hooks.expand(value);
                delete props[name];
                for (index in value) {
                    if (!(index in props)) {
                        props[index] = value[index];
                        specialEasing[index] = easing;
                    }
                }
            } else {
                specialEasing[name] = easing;
            }
        }
    }

    function Animation(elem, properties, options) {
        var result, stopped, index = 0, length = animationPrefilters.length,
            deferred = jQuery.Deferred().always(function () {
                delete tick.elem;
            }), tick = function () {
                if (stopped) {
                    return false;
                }
                var currentTime = fxNow || createFxNow(),
                    remaining = Math.max(0, animation.startTime + animation.duration - currentTime),
                    temp = remaining / animation.duration || 0, percent = 1 - temp, index = 0,
                    length = animation.tweens.length;
                for (; index < length; index++) {
                    animation.tweens[index].run(percent);
                }
                deferred.notifyWith(elem, [animation, percent, remaining]);
                if (percent < 1 && length) {
                    return remaining;
                } else {
                    deferred.resolveWith(elem, [animation]);
                    return false;
                }
            }, animation = deferred.promise({
                elem: elem,
                props: jQuery.extend({}, properties),
                opts: jQuery.extend(true, {specialEasing: {}}, options),
                originalProperties: properties,
                originalOptions: options,
                startTime: fxNow || createFxNow(),
                duration: options.duration,
                tweens: [],
                createTween: function (prop, end) {
                    var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
                    animation.tweens.push(tween);
                    return tween;
                },
                stop: function (gotoEnd) {
                    var index = 0, length = gotoEnd ? animation.tweens.length : 0;
                    if (stopped) {
                        return this;
                    }
                    stopped = true;
                    for (; index < length; index++) {
                        animation.tweens[index].run(1);
                    }
                    if (gotoEnd) {
                        deferred.resolveWith(elem, [animation, gotoEnd]);
                    } else {
                        deferred.rejectWith(elem, [animation, gotoEnd]);
                    }
                    return this;
                }
            }), props = animation.props;
        propFilter(props, animation.opts.specialEasing);
        for (; index < length; index++) {
            result = animationPrefilters[index].call(animation, elem, props, animation.opts);
            if (result) {
                return result;
            }
        }
        jQuery.map(props, createTween, animation);
        if (jQuery.isFunction(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
        }
        jQuery.fx.timer(jQuery.extend(tick, {elem: elem, anim: animation, queue: animation.opts.queue}));
        return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
    }

    jQuery.Animation = jQuery.extend(Animation, {
        tweener: function (props, callback) {
            if (jQuery.isFunction(props)) {
                callback = props;
                props = ["*"];
            } else {
                props = props.split(" ");
            }
            var prop, index = 0, length = props.length;
            for (; index < length; index++) {
                prop = props[index];
                tweeners[prop] = tweeners[prop] || [];
                tweeners[prop].unshift(callback);
            }
        }, prefilter: function (callback, prepend) {
            if (prepend) {
                animationPrefilters.unshift(callback);
            } else {
                animationPrefilters.push(callback);
            }
        }
    });
    jQuery.speed = function (speed, easing, fn) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
        };
        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;
        if (opt.queue == null || opt.queue === true) {
            opt.queue = "fx";
        }
        opt.old = opt.complete;
        opt.complete = function () {
            if (jQuery.isFunction(opt.old)) {
                opt.old.call(this);
            }
            if (opt.queue) {
                jQuery.dequeue(this, opt.queue);
            }
        };
        return opt;
    };
    jQuery.fn.extend({
        fadeTo: function (speed, to, easing, callback) {
            return this.filter(isHidden).css("opacity", 0).show().end().animate({opacity: to}, speed, easing, callback);
        }, animate: function (prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback),
                doAnimation = function () {
                    var anim = Animation(this, jQuery.extend({}, prop), optall);
                    if (empty || jQuery._data(this, "finish")) {
                        anim.stop(true);
                    }
                };
            doAnimation.finish = doAnimation;
            return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        }, stop: function (type, clearQueue, gotoEnd) {
            var stopQueue = function (hooks) {
                var stop = hooks.stop;
                delete hooks.stop;
                stop(gotoEnd);
            };
            if (typeof type !== "string") {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }
            if (clearQueue && type !== false) {
                this.queue(type || "fx", []);
            }
            return this.each(function () {
                var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery.timers,
                    data = jQuery._data(this);
                if (index) {
                    if (data[index] && data[index].stop) {
                        stopQueue(data[index]);
                    }
                } else {
                    for (index in data) {
                        if (data[index] && data[index].stop && rrun.test(index)) {
                            stopQueue(data[index]);
                        }
                    }
                }
                for (index = timers.length; index--;) {
                    if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                        timers[index].anim.stop(gotoEnd);
                        dequeue = false;
                        timers.splice(index, 1);
                    }
                }
                if (dequeue || !gotoEnd) {
                    jQuery.dequeue(this, type);
                }
            });
        }, finish: function (type) {
            if (type !== false) {
                type = type || "fx";
            }
            return this.each(function () {
                var index, data = jQuery._data(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"],
                    timers = jQuery.timers, length = queue ? queue.length : 0;
                data.finish = true;
                jQuery.queue(this, type, []);
                if (hooks && hooks.stop) {
                    hooks.stop.call(this, true);
                }
                for (index = timers.length; index--;) {
                    if (timers[index].elem === this && timers[index].queue === type) {
                        timers[index].anim.stop(true);
                        timers.splice(index, 1);
                    }
                }
                for (index = 0; index < length; index++) {
                    if (queue[index] && queue[index].finish) {
                        queue[index].finish.call(this);
                    }
                }
                delete data.finish;
            });
        }
    });
    jQuery.each(["toggle", "show", "hide"], function (i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function (speed, easing, callback) {
            return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
        };
    });
    jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: {opacity: "show"},
        fadeOut: {opacity: "hide"},
        fadeToggle: {opacity: "toggle"}
    }, function (name, props) {
        jQuery.fn[name] = function (speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    });
    jQuery.timers = [];
    jQuery.fx.tick = function () {
        var timer, timers = jQuery.timers, i = 0;
        fxNow = jQuery.now();
        for (; i < timers.length; i++) {
            timer = timers[i];
            if (!timer() && timers[i] === timer) {
                timers.splice(i--, 1);
            }
        }
        if (!timers.length) {
            jQuery.fx.stop();
        }
        fxNow = undefined;
    };
    jQuery.fx.timer = function (timer) {
        jQuery.timers.push(timer);
        if (timer()) {
            jQuery.fx.start();
        } else {
            jQuery.timers.pop();
        }
    };
    jQuery.fx.interval = 13;
    jQuery.fx.start = function () {
        if (!timerId) {
            timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
        }
    };
    jQuery.fx.stop = function () {
        clearInterval(timerId);
        timerId = null;
    };
    jQuery.fx.speeds = {slow: 600, fast: 200, _default: 400};
    jQuery.fn.delay = function (time, type) {
        time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
        type = type || "fx";
        return this.queue(type, function (next, hooks) {
            var timeout = setTimeout(next, time);
            hooks.stop = function () {
                clearTimeout(timeout);
            };
        });
    };
    (function () {
        var input, div, select, a, opt;
        div = document.createElement("div");
        div.setAttribute("className", "t");
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        a = div.getElementsByTagName("a")[0];
        select = document.createElement("select");
        opt = select.appendChild(document.createElement("option"));
        input = div.getElementsByTagName("input")[0];
        a.style.cssText = "top:1px";
        support.getSetAttribute = div.className !== "t";
        support.style = /top/.test(a.getAttribute("style"));
        support.hrefNormalized = a.getAttribute("href") === "/a";
        support.checkOn = !!input.value;
        support.optSelected = opt.selected;
        support.enctype = !!document.createElement("form").enctype;
        select.disabled = true;
        support.optDisabled = !opt.disabled;
        input = document.createElement("input");
        input.setAttribute("value", "");
        support.input = input.getAttribute("value") === "";
        input.value = "t";
        input.setAttribute("type", "radio");
        support.radioValue = input.value === "t";
    })();
    var rreturn = /\r/g;
    jQuery.fn.extend({
        val: function (value) {
            var hooks, ret, isFunction, elem = this[0];
            if (!arguments.length) {
                if (elem) {
                    hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
                    if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                        return ret;
                    }
                    ret = elem.value;
                    return typeof ret === "string" ? ret.replace(rreturn, "") : ret == null ? "" : ret;
                }
                return;
            }
            isFunction = jQuery.isFunction(value);
            return this.each(function (i) {
                var val;
                if (this.nodeType !== 1) {
                    return;
                }
                if (isFunction) {
                    val = value.call(this, i, jQuery(this).val());
                } else {
                    val = value;
                }
                if (val == null) {
                    val = "";
                } else if (typeof val === "number") {
                    val += "";
                } else if (jQuery.isArray(val)) {
                    val = jQuery.map(val, function (value) {
                        return value == null ? "" : value + "";
                    });
                }
                hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
                if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
                    this.value = val;
                }
            });
        }
    });
    jQuery.extend({
        valHooks: {
            option: {
                get: function (elem) {
                    var val = jQuery.find.attr(elem, "value");
                    return val != null ? val : jQuery.trim(jQuery.text(elem));
                }
            }, select: {
                get: function (elem) {
                    var value, option, options = elem.options, index = elem.selectedIndex,
                        one = elem.type === "select-one" || index < 0, values = one ? null : [],
                        max = one ? index + 1 : options.length, i = index < 0 ? max : one ? index : 0;
                    for (; i < max; i++) {
                        option = options[i];
                        if ((option.selected || i === index) && (support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {
                            value = jQuery(option).val();
                            if (one) {
                                return value;
                            }
                            values.push(value);
                        }
                    }
                    return values;
                }, set: function (elem, value) {
                    var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length;
                    while (i--) {
                        option = options[i];
                        if (jQuery.inArray(jQuery.valHooks.option.get(option), values) >= 0) {
                            try {
                                option.selected = optionSet = true;
                            } catch (_) {
                                option.scrollHeight;
                            }
                        } else {
                            option.selected = false;
                        }
                    }
                    if (!optionSet) {
                        elem.selectedIndex = -1;
                    }
                    return options;
                }
            }
        }
    });
    jQuery.each(["radio", "checkbox"], function () {
        jQuery.valHooks[this] = {
            set: function (elem, value) {
                if (jQuery.isArray(value)) {
                    return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0);
                }
            }
        };
        if (!support.checkOn) {
            jQuery.valHooks[this].get = function (elem) {
                return elem.getAttribute("value") === null ? "on" : elem.value;
            };
        }
    });
    var nodeHook, boolHook, attrHandle = jQuery.expr.attrHandle, ruseDefault = /^(?:checked|selected)$/i,
        getSetAttribute = support.getSetAttribute, getSetInput = support.input;
    jQuery.fn.extend({
        attr: function (name, value) {
            return access(this, jQuery.attr, name, value, arguments.length > 1);
        }, removeAttr: function (name) {
            return this.each(function () {
                jQuery.removeAttr(this, name);
            });
        }
    });
    jQuery.extend({
        attr: function (elem, name, value) {
            var hooks, ret, nType = elem.nodeType;
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }
            if (typeof elem.getAttribute === strundefined) {
                return jQuery.prop(elem, name, value);
            }
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
                name = name.toLowerCase();
                hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook);
            }
            if (value !== undefined) {
                if (value === null) {
                    jQuery.removeAttr(elem, name);
                } else if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;
                } else {
                    elem.setAttribute(name, value + "");
                    return value;
                }
            } else if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
                return ret;
            } else {
                ret = jQuery.find.attr(elem, name);
                return ret == null ? undefined : ret;
            }
        }, removeAttr: function (elem, value) {
            var name, propName, i = 0, attrNames = value && value.match(rnotwhite);
            if (attrNames && elem.nodeType === 1) {
                while ((name = attrNames[i++])) {
                    propName = jQuery.propFix[name] || name;
                    if (jQuery.expr.match.bool.test(name)) {
                        if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
                            elem[propName] = false;
                        } else {
                            elem[jQuery.camelCase("default-" + name)] = elem[propName] = false;
                        }
                    } else {
                        jQuery.attr(elem, name, "");
                    }
                    elem.removeAttribute(getSetAttribute ? name : propName);
                }
            }
        }, attrHooks: {
            type: {
                set: function (elem, value) {
                    if (!support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
                        var val = elem.value;
                        elem.setAttribute("type", value);
                        if (val) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            }
        }
    });
    boolHook = {
        set: function (elem, value, name) {
            if (value === false) {
                jQuery.removeAttr(elem, name);
            } else if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
                elem.setAttribute(!getSetAttribute && jQuery.propFix[name] || name, name);
            } else {
                elem[jQuery.camelCase("default-" + name)] = elem[name] = true;
            }
            return name;
        }
    };
    jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
        var getter = attrHandle[name] || jQuery.find.attr;
        attrHandle[name] = getSetInput && getSetAttribute || !ruseDefault.test(name) ? function (elem, name, isXML) {
            var ret, handle;
            if (!isXML) {
                handle = attrHandle[name];
                attrHandle[name] = ret;
                ret = getter(elem, name, isXML) != null ? name.toLowerCase() : null;
                attrHandle[name] = handle;
            }
            return ret;
        } : function (elem, name, isXML) {
            if (!isXML) {
                return elem[jQuery.camelCase("default-" + name)] ? name.toLowerCase() : null;
            }
        };
    });
    if (!getSetInput || !getSetAttribute) {
        jQuery.attrHooks.value = {
            set: function (elem, value, name) {
                if (jQuery.nodeName(elem, "input")) {
                    elem.defaultValue = value;
                } else {
                    return nodeHook && nodeHook.set(elem, value, name);
                }
            }
        };
    }
    if (!getSetAttribute) {
        nodeHook = {
            set: function (elem, value, name) {
                var ret = elem.getAttributeNode(name);
                if (!ret) {
                    elem.setAttributeNode((ret = elem.ownerDocument.createAttribute(name)));
                }
                ret.value = value += "";
                if (name === "value" || value === elem.getAttribute(name)) {
                    return value;
                }
            }
        };
        attrHandle.id = attrHandle.name = attrHandle.coords = function (elem, name, isXML) {
            var ret;
            if (!isXML) {
                return (ret = elem.getAttributeNode(name)) && ret.value !== "" ? ret.value : null;
            }
        };
        jQuery.valHooks.button = {
            get: function (elem, name) {
                var ret = elem.getAttributeNode(name);
                if (ret && ret.specified) {
                    return ret.value;
                }
            }, set: nodeHook.set
        };
        jQuery.attrHooks.contenteditable = {
            set: function (elem, value, name) {
                nodeHook.set(elem, value === "" ? false : value, name);
            }
        };
        jQuery.each(["width", "height"], function (i, name) {
            jQuery.attrHooks[name] = {
                set: function (elem, value) {
                    if (value === "") {
                        elem.setAttribute(name, "auto");
                        return value;
                    }
                }
            };
        });
    }
    if (!support.style) {
        jQuery.attrHooks.style = {
            get: function (elem) {
                return elem.style.cssText || undefined;
            }, set: function (elem, value) {
                return (elem.style.cssText = value + "");
            }
        };
    }
    var rfocusable = /^(?:input|select|textarea|button|object)$/i, rclickable = /^(?:a|area)$/i;
    jQuery.fn.extend({
        prop: function (name, value) {
            return access(this, jQuery.prop, name, value, arguments.length > 1);
        }, removeProp: function (name) {
            name = jQuery.propFix[name] || name;
            return this.each(function () {
                try {
                    this[name] = undefined;
                    delete this[name];
                } catch (e) {
                }
            });
        }
    });
    jQuery.extend({
        propFix: {"for": "htmlFor", "class": "className"}, prop: function (elem, name, value) {
            var ret, hooks, notxml, nType = elem.nodeType;
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }
            notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
            if (notxml) {
                name = jQuery.propFix[name] || name;
                hooks = jQuery.propHooks[name];
            }
            if (value !== undefined) {
                return hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ? ret : (elem[name] = value);
            } else {
                return hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null ? ret : elem[name];
            }
        }, propHooks: {
            tabIndex: {
                get: function (elem) {
                    var tabindex = jQuery.find.attr(elem, "tabindex");
                    return tabindex ? parseInt(tabindex, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : -1;
                }
            }
        }
    });
    if (!support.hrefNormalized) {
        jQuery.each(["href", "src"], function (i, name) {
            jQuery.propHooks[name] = {
                get: function (elem) {
                    return elem.getAttribute(name, 4);
                }
            };
        });
    }
    if (!support.optSelected) {
        jQuery.propHooks.selected = {
            get: function (elem) {
                var parent = elem.parentNode;
                if (parent) {
                    parent.selectedIndex;
                    if (parent.parentNode) {
                        parent.parentNode.selectedIndex;
                    }
                }
                return null;
            }
        };
    }
    jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
        jQuery.propFix[this.toLowerCase()] = this;
    });
    if (!support.enctype) {
        jQuery.propFix.enctype = "encoding";
    }
    var rclass = /[\t\r\n\f]/g;
    jQuery.fn.extend({
        addClass: function (value) {
            var classes, elem, cur, clazz, j, finalValue, i = 0, len = this.length,
                proceed = typeof value === "string" && value;
            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).addClass(value.call(this, j, this.className));
                });
            }
            if (proceed) {
                classes = (value || "").match(rnotwhite) || [];
                for (; i < len; i++) {
                    elem = this[i];
                    cur = elem.nodeType === 1 && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : " ");
                    if (cur) {
                        j = 0;
                        while ((clazz = classes[j++])) {
                            if (cur.indexOf(" " + clazz + " ") < 0) {
                                cur += clazz + " ";
                            }
                        }
                        finalValue = jQuery.trim(cur);
                        if (elem.className !== finalValue) {
                            elem.className = finalValue;
                        }
                    }
                }
            }
            return this;
        }, removeClass: function (value) {
            var classes, elem, cur, clazz, j, finalValue, i = 0, len = this.length,
                proceed = arguments.length === 0 || typeof value === "string" && value;
            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).removeClass(value.call(this, j, this.className));
                });
            }
            if (proceed) {
                classes = (value || "").match(rnotwhite) || [];
                for (; i < len; i++) {
                    elem = this[i];
                    cur = elem.nodeType === 1 && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : "");
                    if (cur) {
                        j = 0;
                        while ((clazz = classes[j++])) {
                            while (cur.indexOf(" " + clazz + " ") >= 0) {
                                cur = cur.replace(" " + clazz + " ", " ");
                            }
                        }
                        finalValue = value ? jQuery.trim(cur) : "";
                        if (elem.className !== finalValue) {
                            elem.className = finalValue;
                        }
                    }
                }
            }
            return this;
        }, toggleClass: function (value, stateVal) {
            var type = typeof value;
            if (typeof stateVal === "boolean" && type === "string") {
                return stateVal ? this.addClass(value) : this.removeClass(value);
            }
            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
                });
            }
            return this.each(function () {
                if (type === "string") {
                    var className, i = 0, self = jQuery(this), classNames = value.match(rnotwhite) || [];
                    while ((className = classNames[i++])) {
                        if (self.hasClass(className)) {
                            self.removeClass(className);
                        } else {
                            self.addClass(className);
                        }
                    }
                } else if (type === strundefined || type === "boolean") {
                    if (this.className) {
                        jQuery._data(this, "__className__", this.className);
                    }
                    this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
                }
            });
        }, hasClass: function (selector) {
            var className = " " + selector + " ", i = 0, l = this.length;
            for (; i < l; i++) {
                if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) {
                    return true;
                }
            }
            return false;
        }
    });
    jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup error contextmenu").split(" "), function (i, name) {
        jQuery.fn[name] = function (data, fn) {
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
        };
    });
    jQuery.fn.extend({
        hover: function (fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        }, bind: function (types, data, fn) {
            return this.on(types, null, data, fn);
        }, unbind: function (types, fn) {
            return this.off(types, null, fn);
        }, delegate: function (selector, types, data, fn) {
            return this.on(types, selector, data, fn);
        }, undelegate: function (selector, types, fn) {
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        }
    });
    var nonce = jQuery.now();
    var rquery = (/\?/);
    var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    jQuery.parseJSON = function (data) {
        if (window.JSON && window.JSON.parse) {
            return window.JSON.parse(data + "");
        }
        var requireNonComma, depth = null, str = jQuery.trim(data + "");
        return str && !jQuery.trim(str.replace(rvalidtokens, function (token, comma, open, close) {
            if (requireNonComma && comma) {
                depth = 0;
            }
            if (depth === 0) {
                return token;
            }
            requireNonComma = open || comma;
            depth += !close - !open;
            return "";
        })) ? (Function("return " + str))() : jQuery.error("Invalid JSON: " + data);
    };
    jQuery.parseXML = function (data) {
        var xml, tmp;
        if (!data || typeof data !== "string") {
            return null;
        }
        try {
            if (window.DOMParser) {
                tmp = new DOMParser();
                xml = tmp.parseFromString(data, "text/xml");
            } else {
                xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.async = "false";
                xml.loadXML(data);
            }
        } catch (e) {
            xml = undefined;
        }
        if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
            jQuery.error("Invalid XML: " + data);
        }
        return xml;
    };
    var
        ajaxLocParts, ajaxLocation, rhash = /#.*$/, rts = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//, rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, prefilters = {},
        transports = {}, allTypes = "*/".concat("*");
    try {
        ajaxLocation = location.href;
    } catch (e) {
        ajaxLocation = document.createElement("a");
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

    function addToPrefiltersOrTransports(structure) {
        return function (dataTypeExpression, func) {
            if (typeof dataTypeExpression !== "string") {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }
            var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];
            if (jQuery.isFunction(func)) {
                while ((dataType = dataTypes[i++])) {
                    if (dataType.charAt(0) === "+") {
                        dataType = dataType.slice(1) || "*";
                        (structure[dataType] = structure[dataType] || []).unshift(func);
                    } else {
                        (structure[dataType] = structure[dataType] || []).push(func);
                    }
                }
            }
        };
    }

    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
        var inspected = {}, seekingTransport = (structure === transports);

        function inspect(dataType) {
            var selected;
            inspected[dataType] = true;
            jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
                var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
                    options.dataTypes.unshift(dataTypeOrTransport);
                    inspect(dataTypeOrTransport);
                    return false;
                } else if (seekingTransport) {
                    return !(selected = dataTypeOrTransport);
                }
            });
            return selected;
        }

        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
    }

    function ajaxExtend(target, src) {
        var deep, key, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) {
            if (src[key] !== undefined) {
                (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
            }
        }
        if (deep) {
            jQuery.extend(true, target, deep);
        }
        return target;
    }

    function ajaxHandleResponses(s, jqXHR, responses) {
        var firstDataType, ct, finalDataType, type, contents = s.contents, dataTypes = s.dataTypes;
        while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === undefined) {
                ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
        }
        if (ct) {
            for (type in contents) {
                if (contents[type] && contents[type].test(ct)) {
                    dataTypes.unshift(type);
                    break;
                }
            }
        }
        if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
        } else {
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                    finalDataType = type;
                    break;
                }
                if (!firstDataType) {
                    firstDataType = type;
                }
            }
            finalDataType = finalDataType || firstDataType;
        }
        if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
                dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
        }
    }

    function ajaxConvert(s, response, jqXHR, isSuccess) {
        var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
        if (dataTypes[1]) {
            for (conv in s.converters) {
                converters[conv.toLowerCase()] = s.converters[conv];
            }
        }
        current = dataTypes.shift();
        while (current) {
            if (s.responseFields[current]) {
                jqXHR[s.responseFields[current]] = response;
            }
            if (!prev && isSuccess && s.dataFilter) {
                response = s.dataFilter(response, s.dataType);
            }
            prev = current;
            current = dataTypes.shift();
            if (current) {
                if (current === "*") {
                    current = prev;
                } else if (prev !== "*" && prev !== current) {
                    conv = converters[prev + " " + current] || converters["* " + current];
                    if (!conv) {
                        for (conv2 in converters) {
                            tmp = conv2.split(" ");
                            if (tmp[1] === current) {
                                conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                                if (conv) {
                                    if (conv === true) {
                                        conv = converters[conv2];
                                    } else if (converters[conv2] !== true) {
                                        current = tmp[0];
                                        dataTypes.unshift(tmp[1]);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    if (conv !== true) {
                        if (conv && s["throws"]) {
                            response = conv(response);
                        } else {
                            try {
                                response = conv(response);
                            } catch (e) {
                                return {
                                    state: "parsererror",
                                    error: conv ? e : "No conversion from " + prev + " to " + current
                                };
                            }
                        }
                    }
                }
            }
        }
        return {state: "success", data: response};
    }

    jQuery.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: ajaxLocation,
            type: "GET",
            isLocal: rlocalProtocol.test(ajaxLocParts[1]),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {xml: /xml/, html: /html/, json: /json/},
            responseFields: {xml: "responseXML", text: "responseText", json: "responseJSON"},
            converters: {
                "* text": String,
                "text html": true,
                "text json": jQuery.parseJSON,
                "text xml": jQuery.parseXML
            },
            flatOptions: {url: true, context: true}
        },
        ajaxSetup: function (target, settings) {
            return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        ajax: function (url, options) {
            if (typeof url === "object") {
                options = url;
                url = undefined;
            }
            options = options || {};
            var
                parts, i, cacheURL, responseHeadersString, timeoutTimer, fireGlobals, transport, responseHeaders,
                s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s,
                globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event,
                deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"),
                statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, state = 0,
                strAbort = "canceled", jqXHR = {
                    readyState: 0, getResponseHeader: function (key) {
                        var match;
                        if (state === 2) {
                            if (!responseHeaders) {
                                responseHeaders = {};
                                while ((match = rheaders.exec(responseHeadersString))) {
                                    responseHeaders[match[1].toLowerCase()] = match[2];
                                }
                            }
                            match = responseHeaders[key.toLowerCase()];
                        }
                        return match == null ? null : match;
                    }, getAllResponseHeaders: function () {
                        return state === 2 ? responseHeadersString : null;
                    }, setRequestHeader: function (name, value) {
                        var lname = name.toLowerCase();
                        if (!state) {
                            name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                            requestHeaders[name] = value;
                        }
                        return this;
                    }, overrideMimeType: function (type) {
                        if (!state) {
                            s.mimeType = type;
                        }
                        return this;
                    }, statusCode: function (map) {
                        var code;
                        if (map) {
                            if (state < 2) {
                                for (code in map) {
                                    statusCode[code] = [statusCode[code], map[code]];
                                }
                            } else {
                                jqXHR.always(map[jqXHR.status]);
                            }
                        }
                        return this;
                    }, abort: function (statusText) {
                        var finalText = statusText || strAbort;
                        if (transport) {
                            transport.abort(finalText);
                        }
                        done(0, finalText);
                        return this;
                    }
                };
            deferred.promise(jqXHR).complete = completeDeferred.add;
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;
            s.url = ((url || s.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");
            s.type = options.method || options.type || s.method || s.type;
            s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(rnotwhite) || [""];
            if (s.crossDomain == null) {
                parts = rurl.exec(s.url.toLowerCase());
                s.crossDomain = !!(parts && (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] || (parts[3] || (parts[1] === "http:" ? "80" : "443")) !== (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? "80" : "443"))));
            }
            if (s.data && s.processData && typeof s.data !== "string") {
                s.data = jQuery.param(s.data, s.traditional);
            }
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
            if (state === 2) {
                return jqXHR;
            }
            fireGlobals = s.global;
            if (fireGlobals && jQuery.active++ === 0) {
                jQuery.event.trigger("ajaxStart");
            }
            s.type = s.type.toUpperCase();
            s.hasContent = !rnoContent.test(s.type);
            cacheURL = s.url;
            if (!s.hasContent) {
                if (s.data) {
                    cacheURL = (s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data);
                    delete s.data;
                }
                if (s.cache === false) {
                    s.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + nonce++) : cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++;
                }
            }
            if (s.ifModified) {
                if (jQuery.lastModified[cacheURL]) {
                    jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
                }
                if (jQuery.etag[cacheURL]) {
                    jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
                }
            }
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
                jqXHR.setRequestHeader("Content-Type", s.contentType);
            }
            jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
            for (i in s.headers) {
                jqXHR.setRequestHeader(i, s.headers[i]);
            }
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
                return jqXHR.abort();
            }
            strAbort = "abort";
            for (i in{success: 1, error: 1, complete: 1}) {
                jqXHR[i](s[i]);
            }
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
            if (!transport) {
                done(-1, "No Transport");
            } else {
                jqXHR.readyState = 1;
                if (fireGlobals) {
                    globalEventContext.trigger("ajaxSend", [jqXHR, s]);
                }
                if (s.async && s.timeout > 0) {
                    timeoutTimer = setTimeout(function () {
                        jqXHR.abort("timeout");
                    }, s.timeout);
                }
                try {
                    state = 1;
                    transport.send(requestHeaders, done);
                } catch (e) {
                    if (state < 2) {
                        done(-1, e);
                    } else {
                        throw e;
                    }
                }
            }

            function done(status, nativeStatusText, responses, headers) {
                var isSuccess, success, error, response, modified, statusText = nativeStatusText;
                if (state === 2) {
                    return;
                }
                state = 2;
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }
                transport = undefined;
                responseHeadersString = headers || "";
                jqXHR.readyState = status > 0 ? 4 : 0;
                isSuccess = status >= 200 && status < 300 || status === 304;
                if (responses) {
                    response = ajaxHandleResponses(s, jqXHR, responses);
                }
                response = ajaxConvert(s, response, jqXHR, isSuccess);
                if (isSuccess) {
                    if (s.ifModified) {
                        modified = jqXHR.getResponseHeader("Last-Modified");
                        if (modified) {
                            jQuery.lastModified[cacheURL] = modified;
                        }
                        modified = jqXHR.getResponseHeader("etag");
                        if (modified) {
                            jQuery.etag[cacheURL] = modified;
                        }
                    }
                    if (status === 204 || s.type === "HEAD") {
                        statusText = "nocontent";
                    } else if (status === 304) {
                        statusText = "notmodified";
                    } else {
                        statusText = response.state;
                        success = response.data;
                        error = response.error;
                        isSuccess = !error;
                    }
                } else {
                    error = statusText;
                    if (status || !statusText) {
                        statusText = "error";
                        if (status < 0) {
                            status = 0;
                        }
                    }
                }
                jqXHR.status = status;
                jqXHR.statusText = (nativeStatusText || statusText) + "";
                if (isSuccess) {
                    deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
                } else {
                    deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
                }
                jqXHR.statusCode(statusCode);
                statusCode = undefined;
                if (fireGlobals) {
                    globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
                }
                completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
                if (fireGlobals) {
                    globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                    if (!(--jQuery.active)) {
                        jQuery.event.trigger("ajaxStop");
                    }
                }
            }

            return jqXHR;
        },
        getJSON: function (url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        },
        getScript: function (url, callback) {
            return jQuery.get(url, undefined, callback, "script");
        }
    });
    jQuery.each(["get", "post"], function (i, method) {
        jQuery[method] = function (url, data, callback, type) {
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }
            return jQuery.ajax({url: url, type: method, dataType: type, data: data, success: callback});
        };
    });
    jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (i, type) {
        jQuery.fn[type] = function (fn) {
            return this.on(type, fn);
        };
    });
    jQuery._evalUrl = function (url) {
        return jQuery.ajax({url: url, type: "GET", dataType: "script", async: false, global: false, "throws": true});
    };
    jQuery.fn.extend({
        wrapAll: function (html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapAll(html.call(this, i));
                });
            }
            if (this[0]) {
                var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
                if (this[0].parentNode) {
                    wrap.insertBefore(this[0]);
                }
                wrap.map(function () {
                    var elem = this;
                    while (elem.firstChild && elem.firstChild.nodeType === 1) {
                        elem = elem.firstChild;
                    }
                    return elem;
                }).append(this);
            }
            return this;
        }, wrapInner: function (html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapInner(html.call(this, i));
                });
            }
            return this.each(function () {
                var self = jQuery(this), contents = self.contents();
                if (contents.length) {
                    contents.wrapAll(html);
                } else {
                    self.append(html);
                }
            });
        }, wrap: function (html) {
            var isFunction = jQuery.isFunction(html);
            return this.each(function (i) {
                jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
            });
        }, unwrap: function () {
            return this.parent().each(function () {
                if (!jQuery.nodeName(this, "body")) {
                    jQuery(this).replaceWith(this.childNodes);
                }
            }).end();
        }
    });
    jQuery.expr.filters.hidden = function (elem) {
        return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 || (!support.reliableHiddenOffsets() && ((elem.style && elem.style.display) || jQuery.css(elem, "display")) === "none");
    };
    jQuery.expr.filters.visible = function (elem) {
        return !jQuery.expr.filters.hidden(elem);
    };
    var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
        rsubmittable = /^(?:input|select|textarea|keygen)/i;

    function buildParams(prefix, obj, traditional, add) {
        var name;
        if (jQuery.isArray(obj)) {
            jQuery.each(obj, function (i, v) {
                if (traditional || rbracket.test(prefix)) {
                    add(prefix, v);
                } else {
                    buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
                }
            });
        } else if (!traditional && jQuery.type(obj) === "object") {
            for (name in obj) {
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }
        } else {
            add(prefix, obj);
        }
    }

    jQuery.param = function (a, traditional) {
        var prefix, s = [], add = function (key, value) {
            value = jQuery.isFunction(value) ? value() : (value == null ? "" : value);
            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        };
        if (traditional === undefined) {
            traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
        }
        if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
            jQuery.each(a, function () {
                add(this.name, this.value);
            });
        } else {
            for (prefix in a) {
                buildParams(prefix, a[prefix], traditional, add);
            }
        }
        return s.join("&").replace(r20, "+");
    };
    jQuery.fn.extend({
        serialize: function () {
            return jQuery.param(this.serializeArray());
        }, serializeArray: function () {
            return this.map(function () {
                var elements = jQuery.prop(this, "elements");
                return elements ? jQuery.makeArray(elements) : this;
            }).filter(function () {
                var type = this.type;
                return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
            }).map(function (i, elem) {
                var val = jQuery(this).val();
                return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function (val) {
                    return {name: elem.name, value: val.replace(rCRLF, "\r\n")};
                }) : {name: elem.name, value: val.replace(rCRLF, "\r\n")};
            }).get();
        }
    });
    jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ? function () {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && createStandardXHR() || createActiveXHR();
    } : createStandardXHR;
    var xhrId = 0, xhrCallbacks = {}, xhrSupported = jQuery.ajaxSettings.xhr();
    if (window.ActiveXObject) {
        jQuery(window).on("unload", function () {
            for (var key in xhrCallbacks) {
                xhrCallbacks[key](undefined, true);
            }
        });
    }
    support.cors = !!xhrSupported && ("withCredentials" in xhrSupported);
    xhrSupported = support.ajax = !!xhrSupported;
    if (xhrSupported) {
        jQuery.ajaxTransport(function (options) {
            if (!options.crossDomain || support.cors) {
                var callback;
                return {
                    send: function (headers, complete) {
                        var i, xhr = options.xhr(), id = ++xhrId;
                        xhr.open(options.type, options.url, options.async, options.username, options.password);
                        if (options.xhrFields) {
                            for (i in options.xhrFields) {
                                xhr[i] = options.xhrFields[i];
                            }
                        }
                        if (options.mimeType && xhr.overrideMimeType) {
                            xhr.overrideMimeType(options.mimeType);
                        }
                        if (!options.crossDomain && !headers["X-Requested-With"]) {
                            headers["X-Requested-With"] = "XMLHttpRequest";
                        }
                        for (i in headers) {
                            if (headers[i] !== undefined) {
                                xhr.setRequestHeader(i, headers[i] + "");
                            }
                        }
                        xhr.send((options.hasContent && options.data) || null);
                        callback = function (_, isAbort) {
                            var status, statusText, responses;
                            if (callback && (isAbort || xhr.readyState === 4)) {
                                delete xhrCallbacks[id];
                                callback = undefined;
                                xhr.onreadystatechange = jQuery.noop;
                                if (isAbort) {
                                    if (xhr.readyState !== 4) {
                                        xhr.abort();
                                    }
                                } else {
                                    responses = {};
                                    status = xhr.status;
                                    if (typeof xhr.responseText === "string") {
                                        responses.text = xhr.responseText;
                                    }
                                    try {
                                        statusText = xhr.statusText;
                                    } catch (e) {
                                        statusText = "";
                                    }
                                    if (!status && options.isLocal && !options.crossDomain) {
                                        status = responses.text ? 200 : 404;
                                    } else if (status === 1223) {
                                        status = 204;
                                    }
                                }
                            }
                            if (responses) {
                                complete(status, statusText, responses, xhr.getAllResponseHeaders());
                            }
                        };
                        if (!options.async) {
                            callback();
                        } else if (xhr.readyState === 4) {
                            setTimeout(callback);
                        } else {
                            xhr.onreadystatechange = xhrCallbacks[id] = callback;
                        }
                    }, abort: function () {
                        if (callback) {
                            callback(undefined, true);
                        }
                    }
                };
            }
        });
    }

    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch (e) {
        }
    }

    function createActiveXHR() {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
        }
    }

    jQuery.ajaxSetup({
        accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},
        contents: {script: /(?:java|ecma)script/},
        converters: {
            "text script": function (text) {
                jQuery.globalEval(text);
                return text;
            }
        }
    });
    jQuery.ajaxPrefilter("script", function (s) {
        if (s.cache === undefined) {
            s.cache = false;
        }
        if (s.crossDomain) {
            s.type = "GET";
            s.global = false;
        }
    });
    jQuery.ajaxTransport("script", function (s) {
        if (s.crossDomain) {
            var script, head = document.head || jQuery("head")[0] || document.documentElement;
            return {
                send: function (_, callback) {
                    script = document.createElement("script");
                    script.async = true;
                    if (s.scriptCharset) {
                        script.charset = s.scriptCharset;
                    }
                    script.src = s.url;
                    script.onload = script.onreadystatechange = function (_, isAbort) {
                        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                            script.onload = script.onreadystatechange = null;
                            if (script.parentNode) {
                                script.parentNode.removeChild(script);
                            }
                            script = null;
                            if (!isAbort) {
                                callback(200, "success");
                            }
                        }
                    };
                    head.insertBefore(script, head.firstChild);
                }, abort: function () {
                    if (script) {
                        script.onload(undefined, true);
                    }
                }
            };
        }
    });
    var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
    jQuery.ajaxSetup({
        jsonp: "callback", jsonpCallback: function () {
            var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (nonce++));
            this[callback] = true;
            return callback;
        }
    });
    jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer,
            jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data");
        if (jsonProp || s.dataTypes[0] === "jsonp") {
            callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
            if (jsonProp) {
                s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
            } else if (s.jsonp !== false) {
                s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }
            s.converters["script json"] = function () {
                if (!responseContainer) {
                    jQuery.error(callbackName + " was not called");
                }
                return responseContainer[0];
            };
            s.dataTypes[0] = "json";
            overwritten = window[callbackName];
            window[callbackName] = function () {
                responseContainer = arguments;
            };
            jqXHR.always(function () {
                window[callbackName] = overwritten;
                if (s[callbackName]) {
                    s.jsonpCallback = originalSettings.jsonpCallback;
                    oldCallbacks.push(callbackName);
                }
                if (responseContainer && jQuery.isFunction(overwritten)) {
                    overwritten(responseContainer[0]);
                }
                responseContainer = overwritten = undefined;
            });
            return "script";
        }
    });
    jQuery.parseHTML = function (data, context, keepScripts) {
        if (!data || typeof data !== "string") {
            return null;
        }
        if (typeof context === "boolean") {
            keepScripts = context;
            context = false;
        }
        context = context || document;
        var parsed = rsingleTag.exec(data), scripts = !keepScripts && [];
        if (parsed) {
            return [context.createElement(parsed[1])];
        }
        parsed = jQuery.buildFragment([data], context, scripts);
        if (scripts && scripts.length) {
            jQuery(scripts).remove();
        }
        return jQuery.merge([], parsed.childNodes);
    };
    var _load = jQuery.fn.load;
    jQuery.fn.load = function (url, params, callback) {
        if (typeof url !== "string" && _load) {
            return _load.apply(this, arguments);
        }
        var selector, response, type, self = this, off = url.indexOf(" ");
        if (off >= 0) {
            selector = jQuery.trim(url.slice(off, url.length));
            url = url.slice(0, off);
        }
        if (jQuery.isFunction(params)) {
            callback = params;
            params = undefined;
        } else if (params && typeof params === "object") {
            type = "POST";
        }
        if (self.length > 0) {
            jQuery.ajax({url: url, type: type, dataType: "html", data: params}).done(function (responseText) {
                response = arguments;
                self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
            }).complete(callback && function (jqXHR, status) {
                self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
            });
        }
        return this;
    };
    jQuery.expr.filters.animated = function (elem) {
        return jQuery.grep(jQuery.timers, function (fn) {
            return elem === fn.elem;
        }).length;
    };
    var docElem = window.document.documentElement;

    function getWindow(elem) {
        return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
    }

    jQuery.offset = {
        setOffset: function (elem, options, i) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
                position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
            if (position === "static") {
                elem.style.position = "relative";
            }
            curOffset = curElem.offset();
            curCSSTop = jQuery.css(elem, "top");
            curCSSLeft = jQuery.css(elem, "left");
            calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1;
            if (calculatePosition) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }
            if (jQuery.isFunction(options)) {
                options = options.call(elem, i, curOffset);
            }
            if (options.top != null) {
                props.top = (options.top - curOffset.top) + curTop;
            }
            if (options.left != null) {
                props.left = (options.left - curOffset.left) + curLeft;
            }
            if ("using" in options) {
                options.using.call(elem, props);
            } else {
                curElem.css(props);
            }
        }
    };
    jQuery.fn.extend({
        offset: function (options) {
            if (arguments.length) {
                return options === undefined ? this : this.each(function (i) {
                    jQuery.offset.setOffset(this, options, i);
                });
            }
            var docElem, win, box = {top: 0, left: 0}, elem = this[0], doc = elem && elem.ownerDocument;
            if (!doc) {
                return;
            }
            docElem = doc.documentElement;
            if (!jQuery.contains(docElem, elem)) {
                return box;
            }
            if (typeof elem.getBoundingClientRect !== strundefined) {
                box = elem.getBoundingClientRect();
            }
            win = getWindow(doc);
            return {
                top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
                left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
            };
        }, position: function () {
            if (!this[0]) {
                return;
            }
            var offsetParent, offset, parentOffset = {top: 0, left: 0}, elem = this[0];
            if (jQuery.css(elem, "position") === "fixed") {
                offset = elem.getBoundingClientRect();
            } else {
                offsetParent = this.offsetParent();
                offset = this.offset();
                if (!jQuery.nodeName(offsetParent[0], "html")) {
                    parentOffset = offsetParent.offset();
                }
                parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true);
                parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true);
            }
            return {
                top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
                left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
            };
        }, offsetParent: function () {
            return this.map(function () {
                var offsetParent = this.offsetParent || docElem;
                while (offsetParent && (!jQuery.nodeName(offsetParent, "html") && jQuery.css(offsetParent, "position") === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent || docElem;
            });
        }
    });
    jQuery.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (method, prop) {
        var top = /Y/.test(prop);
        jQuery.fn[method] = function (val) {
            return access(this, function (elem, method, val) {
                var win = getWindow(elem);
                if (val === undefined) {
                    return win ? (prop in win) ? win[prop] : win.document.documentElement[method] : elem[method];
                }
                if (win) {
                    win.scrollTo(!top ? val : jQuery(win).scrollLeft(), top ? val : jQuery(win).scrollTop());
                } else {
                    elem[method] = val;
                }
            }, method, val, arguments.length, null);
        };
    });
    jQuery.each(["top", "left"], function (i, prop) {
        jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function (elem, computed) {
            if (computed) {
                computed = curCSS(elem, prop);
                return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
            }
        });
    });
    jQuery.each({Height: "height", Width: "width"}, function (name, type) {
        jQuery.each({padding: "inner" + name, content: type, "": "outer" + name}, function (defaultExtra, funcName) {
            jQuery.fn[funcName] = function (margin, value) {
                var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
                    extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
                return access(this, function (elem, type, value) {
                    var doc;
                    if (jQuery.isWindow(elem)) {
                        return elem.document.documentElement["client" + name];
                    }
                    if (elem.nodeType === 9) {
                        doc = elem.documentElement;
                        return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
                    }
                    return value === undefined ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra);
                }, type, chainable ? margin : undefined, chainable, null);
            };
        });
    });
    jQuery.fn.size = function () {
        return this.length;
    };
    jQuery.fn.andSelf = jQuery.fn.addBack;
    if (typeof define === "function" && define.amd) {
        define("jquery", [], function () {
            return jQuery;
        });
    }
    var
        _jQuery = window.jQuery, _$ = window.$;
    jQuery.noConflict = function (deep) {
        if (window.$ === jQuery) {
            window.$ = _$;
        }
        if (deep && window.jQuery === jQuery) {
            window.jQuery = _jQuery;
        }
        return jQuery;
    };
    if (typeof noGlobal === strundefined) {
        window.jQuery = window.$ = jQuery;
    }
    return jQuery;
}));
/*! jQuery UI - v1.10.3 - 2013-12-19
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.position.js, jquery.ui.autocomplete.js, jquery.ui.menu.js, jquery.ui.effect.js, jquery.ui.effect-highlight.js
* Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */

(function (e, t) {
    function i(t, i) {
        var s, n, r, o = t.nodeName.toLowerCase();
        return "area" === o ? (s = t.parentNode, n = s.name, t.href && n && "map" === s.nodeName.toLowerCase() ? (r = e("img[usemap=#" + n + "]")[0], !!r && a(r)) : !1) : (/input|select|textarea|button|object/.test(o) ? !t.disabled : "a" === o ? t.href || i : i) && a(t)
    }

    function a(t) {
        return e.expr.filters.visible(t) && !e(t).parents().addBack().filter(function () {
            return "hidden" === e.css(this, "visibility")
        }).length
    }

    var s = 0, n = /^ui-id-\d+$/;
    e.ui = e.ui || {}, e.extend(e.ui, {
        version: "1.10.3",
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    }), e.fn.extend({
        focus: function (t) {
            return function (i, a) {
                return "number" == typeof i ? this.each(function () {
                    var t = this;
                    setTimeout(function () {
                        e(t).focus(), a && a.call(t)
                    }, i)
                }) : t.apply(this, arguments)
            }
        }(e.fn.focus), scrollParent: function () {
            var t;
            return t = e.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () {
                return /(relative|absolute|fixed)/.test(e.css(this, "position")) && /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"))
            }).eq(0) : this.parents().filter(function () {
                return /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"))
            }).eq(0), /fixed/.test(this.css("position")) || !t.length ? e(document) : t
        }, zIndex: function (i) {
            if (i !== t) return this.css("zIndex", i);
            if (this.length) for (var a, s, n = e(this[0]); n.length && n[0] !== document;) {
                if (a = n.css("position"), ("absolute" === a || "relative" === a || "fixed" === a) && (s = parseInt(n.css("zIndex"), 10), !isNaN(s) && 0 !== s)) return s;
                n = n.parent()
            }
            return 0
        }, uniqueId: function () {
            return this.each(function () {
                this.id || (this.id = "ui-id-" + ++s)
            })
        }, removeUniqueId: function () {
            return this.each(function () {
                n.test(this.id) && e(this).removeAttr("id")
            })
        }
    }), e.extend(e.expr[":"], {
        data: e.expr.createPseudo ? e.expr.createPseudo(function (t) {
            return function (i) {
                return !!e.data(i, t)
            }
        }) : function (t, i, a) {
            return !!e.data(t, a[3])
        }, focusable: function (t) {
            return i(t, !isNaN(e.attr(t, "tabindex")))
        }, tabbable: function (t) {
            var a = e.attr(t, "tabindex"), s = isNaN(a);
            return (s || a >= 0) && i(t, !s)
        }
    }), e("<a>").outerWidth(1).jquery || e.each(["Width", "Height"], function (i, a) {
        function s(t, i, a, s) {
            return e.each(n, function () {
                i -= parseFloat(e.css(t, "padding" + this)) || 0, a && (i -= parseFloat(e.css(t, "border" + this + "Width")) || 0), s && (i -= parseFloat(e.css(t, "margin" + this)) || 0)
            }), i
        }

        var n = "Width" === a ? ["Left", "Right"] : ["Top", "Bottom"], r = a.toLowerCase(), o = {
            innerWidth: e.fn.innerWidth,
            innerHeight: e.fn.innerHeight,
            outerWidth: e.fn.outerWidth,
            outerHeight: e.fn.outerHeight
        };
        e.fn["inner" + a] = function (i) {
            return i === t ? o["inner" + a].call(this) : this.each(function () {
                e(this).css(r, s(this, i) + "px")
            })
        }, e.fn["outer" + a] = function (t, i) {
            return "number" != typeof t ? o["outer" + a].call(this, t) : this.each(function () {
                e(this).css(r, s(this, t, !0, i) + "px")
            })
        }
    }), e.fn.addBack || (e.fn.addBack = function (e) {
        return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
    }), e("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (e.fn.removeData = function (t) {
        return function (i) {
            return arguments.length ? t.call(this, e.camelCase(i)) : t.call(this)
        }
    }(e.fn.removeData)), e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), e.support.selectstart = "onselectstart" in document.createElement("div"), e.fn.extend({
        disableSelection: function () {
            return this.bind((e.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (e) {
                e.preventDefault()
            })
        }, enableSelection: function () {
            return this.unbind(".ui-disableSelection")
        }
    }), e.extend(e.ui, {
        plugin: {
            add: function (t, i, a) {
                var s, n = e.ui[t].prototype;
                for (s in a) n.plugins[s] = n.plugins[s] || [], n.plugins[s].push([i, a[s]])
            }, call: function (e, t, i) {
                var a, s = e.plugins[t];
                if (s && e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType) for (a = 0; s.length > a; a++) e.options[s[a][0]] && s[a][1].apply(e.element, i)
            }
        }, hasScroll: function (t, i) {
            if ("hidden" === e(t).css("overflow")) return !1;
            var a = i && "left" === i ? "scrollLeft" : "scrollTop", s = !1;
            return t[a] > 0 ? !0 : (t[a] = 1, s = t[a] > 0, t[a] = 0, s)
        }
    })
})(jQuery);
(function (e, t) {
    var i = 0, s = Array.prototype.slice, a = e.cleanData;
    e.cleanData = function (t) {
        for (var i, s = 0; null != (i = t[s]); s++) try {
            e(i).triggerHandler("remove")
        } catch (n) {
        }
        a(t)
    }, e.widget = function (i, s, a) {
        var n, r, o, h, l = {}, u = i.split(".")[0];
        i = i.split(".")[1], n = u + "-" + i, a || (a = s, s = e.Widget), e.expr[":"][n.toLowerCase()] = function (t) {
            return !!e.data(t, n)
        }, e[u] = e[u] || {}, r = e[u][i], o = e[u][i] = function (e, i) {
            return this._createWidget ? (arguments.length && this._createWidget(e, i), t) : new o(e, i)
        }, e.extend(o, r, {
            version: a.version,
            _proto: e.extend({}, a),
            _childConstructors: []
        }), h = new s, h.options = e.widget.extend({}, h.options), e.each(a, function (i, a) {
            return e.isFunction(a) ? (l[i] = function () {
                var e = function () {
                    return s.prototype[i].apply(this, arguments)
                }, t = function (e) {
                    return s.prototype[i].apply(this, e)
                };
                return function () {
                    var i, s = this._super, n = this._superApply;
                    return this._super = e, this._superApply = t, i = a.apply(this, arguments), this._super = s, this._superApply = n, i
                }
            }(), t) : (l[i] = a, t)
        }), o.prototype = e.widget.extend(h, {widgetEventPrefix: r ? h.widgetEventPrefix : i}, l, {
            constructor: o,
            namespace: u,
            widgetName: i,
            widgetFullName: n
        }), r ? (e.each(r._childConstructors, function (t, i) {
            var s = i.prototype;
            e.widget(s.namespace + "." + s.widgetName, o, i._proto)
        }), delete r._childConstructors) : s._childConstructors.push(o), e.widget.bridge(i, o)
    }, e.widget.extend = function (i) {
        for (var a, n, r = s.call(arguments, 1), o = 0, h = r.length; h > o; o++) for (a in r[o]) n = r[o][a], r[o].hasOwnProperty(a) && n !== t && (i[a] = e.isPlainObject(n) ? e.isPlainObject(i[a]) ? e.widget.extend({}, i[a], n) : e.widget.extend({}, n) : n);
        return i
    }, e.widget.bridge = function (i, a) {
        var n = a.prototype.widgetFullName || i;
        e.fn[i] = function (r) {
            var o = "string" == typeof r, h = s.call(arguments, 1), l = this;
            return r = !o && h.length ? e.widget.extend.apply(null, [r].concat(h)) : r, o ? this.each(function () {
                var s, a = e.data(this, n);
                return a ? e.isFunction(a[r]) && "_" !== r.charAt(0) ? (s = a[r].apply(a, h), s !== a && s !== t ? (l = s && s.jquery ? l.pushStack(s.get()) : s, !1) : t) : e.error("no such method '" + r + "' for " + i + " widget instance") : e.error("cannot call methods on " + i + " prior to initialization; " + "attempted to call method '" + r + "'")
            }) : this.each(function () {
                var t = e.data(this, n);
                t ? t.option(r || {})._init() : e.data(this, n, new a(r, this))
            }), l
        }
    }, e.Widget = function () {
    }, e.Widget._childConstructors = [], e.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {disabled: !1, create: null},
        _createWidget: function (t, s) {
            s = e(s || this.defaultElement || this)[0], this.element = e(s), this.uuid = i++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = e.widget.extend({}, this.options, this._getCreateOptions(), t), this.bindings = e(), this.hoverable = e(), this.focusable = e(), s !== this && (e.data(s, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function (e) {
                    e.target === s && this.destroy()
                }
            }), this.document = e(s.style ? s.ownerDocument : s.document || s), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
        },
        _getCreateOptions: e.noop,
        _getCreateEventData: e.noop,
        _create: e.noop,
        _init: e.noop,
        destroy: function () {
            this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
        },
        _destroy: e.noop,
        widget: function () {
            return this.element
        },
        option: function (i, s) {
            var a, n, r, o = i;
            if (0 === arguments.length) return e.widget.extend({}, this.options);
            if ("string" == typeof i) if (o = {}, a = i.split("."), i = a.shift(), a.length) {
                for (n = o[i] = e.widget.extend({}, this.options[i]), r = 0; a.length - 1 > r; r++) n[a[r]] = n[a[r]] || {}, n = n[a[r]];
                if (i = a.pop(), s === t) return n[i] === t ? null : n[i];
                n[i] = s
            } else {
                if (s === t) return this.options[i] === t ? null : this.options[i];
                o[i] = s
            }
            return this._setOptions(o), this
        },
        _setOptions: function (e) {
            var t;
            for (t in e) this._setOption(t, e[t]);
            return this
        },
        _setOption: function (e, t) {
            return this.options[e] = t, "disabled" === e && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!t).attr("aria-disabled", t), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this
        },
        enable: function () {
            return this._setOption("disabled", !1)
        },
        disable: function () {
            return this._setOption("disabled", !0)
        },
        _on: function (i, s, a) {
            var n, r = this;
            "boolean" != typeof i && (a = s, s = i, i = !1), a ? (s = n = e(s), this.bindings = this.bindings.add(s)) : (a = s, s = this.element, n = this.widget()), e.each(a, function (a, o) {
                function h() {
                    return i || r.options.disabled !== !0 && !e(this).hasClass("ui-state-disabled") ? ("string" == typeof o ? r[o] : o).apply(r, arguments) : t
                }

                "string" != typeof o && (h.guid = o.guid = o.guid || h.guid || e.guid++);
                var l = a.match(/^(\w+)\s*(.*)$/), u = l[1] + r.eventNamespace, c = l[2];
                c ? n.delegate(c, u, h) : s.bind(u, h)
            })
        },
        _off: function (e, t) {
            t = (t || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, e.unbind(t).undelegate(t)
        },
        _delay: function (e, t) {
            function i() {
                return ("string" == typeof e ? s[e] : e).apply(s, arguments)
            }

            var s = this;
            return setTimeout(i, t || 0)
        },
        _hoverable: function (t) {
            this.hoverable = this.hoverable.add(t), this._on(t, {
                mouseenter: function (t) {
                    e(t.currentTarget).addClass("ui-state-hover")
                }, mouseleave: function (t) {
                    e(t.currentTarget).removeClass("ui-state-hover")
                }
            })
        },
        _focusable: function (t) {
            this.focusable = this.focusable.add(t), this._on(t, {
                focusin: function (t) {
                    e(t.currentTarget).addClass("ui-state-focus")
                }, focusout: function (t) {
                    e(t.currentTarget).removeClass("ui-state-focus")
                }
            })
        },
        _trigger: function (t, i, s) {
            var a, n, r = this.options[t];
            if (s = s || {}, i = e.Event(i), i.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), i.target = this.element[0], n = i.originalEvent) for (a in n) a in i || (i[a] = n[a]);
            return this.element.trigger(i, s), !(e.isFunction(r) && r.apply(this.element[0], [i].concat(s)) === !1 || i.isDefaultPrevented())
        }
    }, e.each({show: "fadeIn", hide: "fadeOut"}, function (t, i) {
        e.Widget.prototype["_" + t] = function (s, a, n) {
            "string" == typeof a && (a = {effect: a});
            var r, o = a ? a === !0 || "number" == typeof a ? i : a.effect || i : t;
            a = a || {}, "number" == typeof a && (a = {duration: a}), r = !e.isEmptyObject(a), a.complete = n, a.delay && s.delay(a.delay), r && e.effects && e.effects.effect[o] ? s[t](a) : o !== t && s[o] ? s[o](a.duration, a.easing, n) : s.queue(function (i) {
                e(this)[t](), n && n.call(s[0]), i()
            })
        }
    })
})(jQuery);
(function (e, t) {
    function i(e, t, i) {
        return [parseFloat(e[0]) * (p.test(e[0]) ? t / 100 : 1), parseFloat(e[1]) * (p.test(e[1]) ? i / 100 : 1)]
    }

    function s(t, i) {
        return parseInt(e.css(t, i), 10) || 0
    }

    function a(t) {
        var i = t[0];
        return 9 === i.nodeType ? {
            width: t.width(),
            height: t.height(),
            offset: {top: 0, left: 0}
        } : e.isWindow(i) ? {
            width: t.width(),
            height: t.height(),
            offset: {top: t.scrollTop(), left: t.scrollLeft()}
        } : i.preventDefault ? {width: 0, height: 0, offset: {top: i.pageY, left: i.pageX}} : {
            width: t.outerWidth(),
            height: t.outerHeight(),
            offset: t.offset()
        }
    }

    e.ui = e.ui || {};
    var n, r = Math.max, o = Math.abs, h = Math.round, l = /left|center|right/, u = /top|center|bottom/,
        c = /[\+\-]\d+(\.[\d]+)?%?/, d = /^\w+/, p = /%$/, f = e.fn.position;
    e.position = {
        scrollbarWidth: function () {
            if (n !== t) return n;
            var i, s,
                a = e("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
                r = a.children()[0];
            return e("body").append(a), i = r.offsetWidth, a.css("overflow", "scroll"), s = r.offsetWidth, i === s && (s = a[0].clientWidth), a.remove(), n = i - s
        }, getScrollInfo: function (t) {
            var i = t.isWindow ? "" : t.element.css("overflow-x"), s = t.isWindow ? "" : t.element.css("overflow-y"),
                a = "scroll" === i || "auto" === i && t.width < t.element[0].scrollWidth,
                n = "scroll" === s || "auto" === s && t.height < t.element[0].scrollHeight;
            return {width: n ? e.position.scrollbarWidth() : 0, height: a ? e.position.scrollbarWidth() : 0}
        }, getWithinInfo: function (t) {
            var i = e(t || window), s = e.isWindow(i[0]);
            return {
                element: i,
                isWindow: s,
                offset: i.offset() || {left: 0, top: 0},
                scrollLeft: i.scrollLeft(),
                scrollTop: i.scrollTop(),
                width: s ? i.width() : i.outerWidth(),
                height: s ? i.height() : i.outerHeight()
            }
        }
    }, e.fn.position = function (t) {
        if (!t || !t.of) return f.apply(this, arguments);
        t = e.extend({}, t);
        var n, p, m, g, v, y, b = e(t.of), _ = e.position.getWithinInfo(t.within), x = e.position.getScrollInfo(_),
            k = (t.collision || "flip").split(" "), w = {};
        return y = a(b), b[0].preventDefault && (t.at = "left top"), p = y.width, m = y.height, g = y.offset, v = e.extend({}, g), e.each(["my", "at"], function () {
            var e, i, s = (t[this] || "").split(" ");
            1 === s.length && (s = l.test(s[0]) ? s.concat(["center"]) : u.test(s[0]) ? ["center"].concat(s) : ["center", "center"]), s[0] = l.test(s[0]) ? s[0] : "center", s[1] = u.test(s[1]) ? s[1] : "center", e = c.exec(s[0]), i = c.exec(s[1]), w[this] = [e ? e[0] : 0, i ? i[0] : 0], t[this] = [d.exec(s[0])[0], d.exec(s[1])[0]]
        }), 1 === k.length && (k[1] = k[0]), "right" === t.at[0] ? v.left += p : "center" === t.at[0] && (v.left += p / 2), "bottom" === t.at[1] ? v.top += m : "center" === t.at[1] && (v.top += m / 2), n = i(w.at, p, m), v.left += n[0], v.top += n[1], this.each(function () {
            var a, l, u = e(this), c = u.outerWidth(), d = u.outerHeight(), f = s(this, "marginLeft"),
                y = s(this, "marginTop"), D = c + f + s(this, "marginRight") + x.width,
                T = d + y + s(this, "marginBottom") + x.height, M = e.extend({}, v),
                S = i(w.my, u.outerWidth(), u.outerHeight());
            "right" === t.my[0] ? M.left -= c : "center" === t.my[0] && (M.left -= c / 2), "bottom" === t.my[1] ? M.top -= d : "center" === t.my[1] && (M.top -= d / 2), M.left += S[0], M.top += S[1], e.support.offsetFractions || (M.left = h(M.left), M.top = h(M.top)), a = {
                marginLeft: f,
                marginTop: y
            }, e.each(["left", "top"], function (i, s) {
                e.ui.position[k[i]] && e.ui.position[k[i]][s](M, {
                    targetWidth: p,
                    targetHeight: m,
                    elemWidth: c,
                    elemHeight: d,
                    collisionPosition: a,
                    collisionWidth: D,
                    collisionHeight: T,
                    offset: [n[0] + S[0], n[1] + S[1]],
                    my: t.my,
                    at: t.at,
                    within: _,
                    elem: u
                })
            }), t.using && (l = function (e) {
                var i = g.left - M.left, s = i + p - c, a = g.top - M.top, n = a + m - d, h = {
                    target: {element: b, left: g.left, top: g.top, width: p, height: m},
                    element: {element: u, left: M.left, top: M.top, width: c, height: d},
                    horizontal: 0 > s ? "left" : i > 0 ? "right" : "center",
                    vertical: 0 > n ? "top" : a > 0 ? "bottom" : "middle"
                };
                c > p && p > o(i + s) && (h.horizontal = "center"), d > m && m > o(a + n) && (h.vertical = "middle"), h.important = r(o(i), o(s)) > r(o(a), o(n)) ? "horizontal" : "vertical", t.using.call(this, e, h)
            }), u.offset(e.extend(M, {using: l}))
        })
    }, e.ui.position = {
        fit: {
            left: function (e, t) {
                var i, s = t.within, a = s.isWindow ? s.scrollLeft : s.offset.left, n = s.width,
                    o = e.left - t.collisionPosition.marginLeft, h = a - o, l = o + t.collisionWidth - n - a;
                t.collisionWidth > n ? h > 0 && 0 >= l ? (i = e.left + h + t.collisionWidth - n - a, e.left += h - i) : e.left = l > 0 && 0 >= h ? a : h > l ? a + n - t.collisionWidth : a : h > 0 ? e.left += h : l > 0 ? e.left -= l : e.left = r(e.left - o, e.left)
            }, top: function (e, t) {
                var i, s = t.within, a = s.isWindow ? s.scrollTop : s.offset.top, n = t.within.height,
                    o = e.top - t.collisionPosition.marginTop, h = a - o, l = o + t.collisionHeight - n - a;
                t.collisionHeight > n ? h > 0 && 0 >= l ? (i = e.top + h + t.collisionHeight - n - a, e.top += h - i) : e.top = l > 0 && 0 >= h ? a : h > l ? a + n - t.collisionHeight : a : h > 0 ? e.top += h : l > 0 ? e.top -= l : e.top = r(e.top - o, e.top)
            }
        }, flip: {
            left: function (e, t) {
                var i, s, a = t.within, n = a.offset.left + a.scrollLeft, r = a.width,
                    h = a.isWindow ? a.scrollLeft : a.offset.left, l = e.left - t.collisionPosition.marginLeft,
                    u = l - h, c = l + t.collisionWidth - r - h,
                    d = "left" === t.my[0] ? -t.elemWidth : "right" === t.my[0] ? t.elemWidth : 0,
                    p = "left" === t.at[0] ? t.targetWidth : "right" === t.at[0] ? -t.targetWidth : 0,
                    f = -2 * t.offset[0];
                0 > u ? (i = e.left + d + p + f + t.collisionWidth - r - n, (0 > i || o(u) > i) && (e.left += d + p + f)) : c > 0 && (s = e.left - t.collisionPosition.marginLeft + d + p + f - h, (s > 0 || c > o(s)) && (e.left += d + p + f))
            }, top: function (e, t) {
                var i, s, a = t.within, n = a.offset.top + a.scrollTop, r = a.height,
                    h = a.isWindow ? a.scrollTop : a.offset.top, l = e.top - t.collisionPosition.marginTop, u = l - h,
                    c = l + t.collisionHeight - r - h, d = "top" === t.my[1],
                    p = d ? -t.elemHeight : "bottom" === t.my[1] ? t.elemHeight : 0,
                    f = "top" === t.at[1] ? t.targetHeight : "bottom" === t.at[1] ? -t.targetHeight : 0,
                    m = -2 * t.offset[1];
                0 > u ? (s = e.top + p + f + m + t.collisionHeight - r - n, e.top + p + f + m > u && (0 > s || o(u) > s) && (e.top += p + f + m)) : c > 0 && (i = e.top - t.collisionPosition.marginTop + p + f + m - h, e.top + p + f + m > c && (i > 0 || c > o(i)) && (e.top += p + f + m))
            }
        }, flipfit: {
            left: function () {
                e.ui.position.flip.left.apply(this, arguments), e.ui.position.fit.left.apply(this, arguments)
            }, top: function () {
                e.ui.position.flip.top.apply(this, arguments), e.ui.position.fit.top.apply(this, arguments)
            }
        }
    }, function () {
        var t, i, s, a, n, r = document.getElementsByTagName("body")[0], o = document.createElement("div");
        t = document.createElement(r ? "div" : "body"), s = {
            visibility: "hidden",
            width: 0,
            height: 0,
            border: 0,
            margin: 0,
            background: "none"
        }, r && e.extend(s, {position: "absolute", left: "-1000px", top: "-1000px"});
        for (n in s) t.style[n] = s[n];
        t.appendChild(o), i = r || document.documentElement, i.insertBefore(t, i.firstChild), o.style.cssText = "position: absolute; left: 10.7432222px;", a = e(o).offset().left, e.support.offsetFractions = a > 10 && 11 > a, t.innerHTML = "", i.removeChild(t)
    }()
})(jQuery);
(function (e) {
    var t = 0;
    e.widget("ui.autocomplete", {
        version: "1.10.3",
        defaultElement: "<input>",
        options: {
            appendTo: null,
            autoFocus: !1,
            delay: 300,
            minLength: 1,
            position: {my: "left top", at: "left bottom", collision: "none"},
            source: null,
            change: null,
            close: null,
            focus: null,
            open: null,
            response: null,
            search: null,
            select: null
        },
        pending: 0,
        _create: function () {
            var t, i, a, s = this.element[0].nodeName.toLowerCase(), n = "textarea" === s, r = "input" === s;
            this.isMultiLine = n ? !0 : r ? !1 : this.element.prop("isContentEditable"), this.valueMethod = this.element[n || r ? "val" : "text"], this.isNewMenu = !0, this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off"), this._on(this.element, {
                keydown: function (s) {
                    if (this.element.prop("readOnly")) return t = !0, a = !0, i = !0, undefined;
                    t = !1, a = !1, i = !1;
                    var n = e.ui.keyCode;
                    switch (s.keyCode) {
                        case n.PAGE_UP:
                            t = !0, this._move("previousPage", s);
                            break;
                        case n.PAGE_DOWN:
                            t = !0, this._move("nextPage", s);
                            break;
                        case n.UP:
                            t = !0, this._keyEvent("previous", s);
                            break;
                        case n.DOWN:
                            t = !0, this._keyEvent("next", s);
                            break;
                        case n.ENTER:
                        case n.NUMPAD_ENTER:
                            this.menu.active && (t = !0, s.preventDefault(), this.menu.select(s));
                            break;
                        case n.TAB:
                            this.menu.active && this.menu.select(s);
                            break;
                        case n.ESCAPE:
                            this.menu.element.is(":visible") && (this._value(this.term), this.close(s), s.preventDefault());
                            break;
                        default:
                            i = !0, this._searchTimeout(s)
                    }
                }, keypress: function (a) {
                    if (t) return t = !1, (!this.isMultiLine || this.menu.element.is(":visible")) && a.preventDefault(), undefined;
                    if (!i) {
                        var s = e.ui.keyCode;
                        switch (a.keyCode) {
                            case s.PAGE_UP:
                                this._move("previousPage", a);
                                break;
                            case s.PAGE_DOWN:
                                this._move("nextPage", a);
                                break;
                            case s.UP:
                                this._keyEvent("previous", a);
                                break;
                            case s.DOWN:
                                this._keyEvent("next", a)
                        }
                    }
                }, input: function (e) {
                    return a ? (a = !1, e.preventDefault(), undefined) : (this._searchTimeout(e), undefined)
                }, focus: function () {
                    this.selectedItem = null, this.previous = this._value()
                }, blur: function (e) {
                    return this.cancelBlur ? (delete this.cancelBlur, undefined) : (clearTimeout(this.searching), this.close(e), this._change(e), undefined)
                }
            }), this._initSource(), this.menu = e("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({role: null}).hide().data("ui-menu"), this._on(this.menu.element, {
                mousedown: function (t) {
                    t.preventDefault(), this.cancelBlur = !0, this._delay(function () {
                        delete this.cancelBlur
                    });
                    var i = this.menu.element[0];
                    e(t.target).closest(".ui-menu-item").length || this._delay(function () {
                        var t = this;
                        this.document.one("mousedown", function (a) {
                            a.target === t.element[0] || a.target === i || e.contains(i, a.target) || t.close()
                        })
                    })
                }, menufocus: function (t, i) {
                    if (this.isNewMenu && (this.isNewMenu = !1, t.originalEvent && /^mouse/.test(t.originalEvent.type))) return this.menu.blur(), this.document.one("mousemove", function () {
                        e(t.target).trigger(t.originalEvent)
                    }), undefined;
                    var a = i.item.data("ui-autocomplete-item");
                    !1 !== this._trigger("focus", t, {item: a}) ? t.originalEvent && /^key/.test(t.originalEvent.type) && this._value(a.value) : this.liveRegion.text(a.value)
                }, menuselect: function (e, t) {
                    var i = t.item.data("ui-autocomplete-item"), a = this.previous;
                    this.element[0] !== this.document[0].activeElement && (this.element.focus(), this.previous = a, this._delay(function () {
                        this.previous = a, this.selectedItem = i
                    })), !1 !== this._trigger("select", e, {item: i}) && this._value(i.value), this.term = this._value(), this.close(e), this.selectedItem = i
                }
            }), this.liveRegion = e("<span>", {
                role: "status",
                "aria-live": "polite"
            }).addClass("ui-helper-hidden-accessible").insertBefore(this.element), this._on(this.window, {
                beforeunload: function () {
                    this.element.removeAttr("autocomplete")
                }
            })
        },
        _destroy: function () {
            clearTimeout(this.searching), this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"), this.menu.element.remove(), this.liveRegion.remove()
        },
        _setOption: function (e, t) {
            this._super(e, t), "source" === e && this._initSource(), "appendTo" === e && this.menu.element.appendTo(this._appendTo()), "disabled" === e && t && this.xhr && this.xhr.abort()
        },
        _appendTo: function () {
            var t = this.options.appendTo;
            return t && (t = t.jquery || t.nodeType ? e(t) : this.document.find(t).eq(0)), t || (t = this.element.closest(".ui-front")), t.length || (t = this.document[0].body), t
        },
        _initSource: function () {
            var t, i, a = this;
            e.isArray(this.options.source) ? (t = this.options.source, this.source = function (i, a) {
                a(e.ui.autocomplete.filter(t, i.term))
            }) : "string" == typeof this.options.source ? (i = this.options.source, this.source = function (t, s) {
                a.xhr && a.xhr.abort(), a.xhr = e.ajax({
                    url: i, data: t, dataType: "json", success: function (e) {
                        s(e)
                    }, error: function () {
                        s([])
                    }
                })
            }) : this.source = this.options.source
        },
        _searchTimeout: function (e) {
            clearTimeout(this.searching), this.searching = this._delay(function () {
                this.term !== this._value() && (this.selectedItem = null, this.search(null, e))
            }, this.options.delay)
        },
        search: function (e, t) {
            return e = null != e ? e : this._value(), this.term = this._value(), e.length < this.options.minLength ? this.close(t) : this._trigger("search", t) !== !1 ? this._search(e) : undefined
        },
        _search: function (e) {
            this.pending++, this.element.addClass("ui-autocomplete-loading"), this.cancelSearch = !1, this.source({term: e}, this._response())
        },
        _response: function () {
            var e = this, i = ++t;
            return function (a) {
                i === t && e.__response(a), e.pending--, e.pending || e.element.removeClass("ui-autocomplete-loading")
            }
        },
        __response: function (e) {
            e && (e = this._normalize(e)), this._trigger("response", null, {content: e}), !this.options.disabled && e && e.length && !this.cancelSearch ? (this._suggest(e), this._trigger("open")) : this._close()
        },
        close: function (e) {
            this.cancelSearch = !0, this._close(e)
        },
        _close: function (e) {
            this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.blur(), this.isNewMenu = !0, this._trigger("close", e))
        },
        _change: function (e) {
            this.previous !== this._value() && this._trigger("change", e, {item: this.selectedItem})
        },
        _normalize: function (t) {
            return t.length && t[0].label && t[0].value ? t : e.map(t, function (t) {
                return "string" == typeof t ? {label: t, value: t} : e.extend({
                    label: t.label || t.value,
                    value: t.value || t.label
                }, t)
            })
        },
        _suggest: function (t) {
            var i = this.menu.element.empty();
            this._renderMenu(i, t), this.isNewMenu = !0, this.menu.refresh(), i.show(), this._resizeMenu(), i.position(e.extend({of: this.element}, this.options.position)), this.options.autoFocus && this.menu.next()
        },
        _resizeMenu: function () {
            var e = this.menu.element;
            e.outerWidth(Math.max(e.width("").outerWidth() + 1, this.element.outerWidth()))
        },
        _renderMenu: function (t, i) {
            var a = this;
            e.each(i, function (e, i) {
                a._renderItemData(t, i)
            })
        },
        _renderItemData: function (e, t) {
            return this._renderItem(e, t).data("ui-autocomplete-item", t)
        },
        _renderItem: function (t, i) {
            return e("<li>").append(e("<a>").text(i.label)).appendTo(t)
        },
        _move: function (e, t) {
            return this.menu.element.is(":visible") ? this.menu.isFirstItem() && /^previous/.test(e) || this.menu.isLastItem() && /^next/.test(e) ? (this._value(this.term), this.menu.blur(), undefined) : (this.menu[e](t), undefined) : (this.search(null, t), undefined)
        },
        widget: function () {
            return this.menu.element
        },
        _value: function () {
            return this.valueMethod.apply(this.element, arguments)
        },
        _keyEvent: function (e, t) {
            (!this.isMultiLine || this.menu.element.is(":visible")) && (this._move(e, t), t.preventDefault())
        }
    }), e.extend(e.ui.autocomplete, {
        escapeRegex: function (e) {
            return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
        }, filter: function (t, i) {
            var a = RegExp(e.ui.autocomplete.escapeRegex(i), "i");
            return e.grep(t, function (e) {
                return a.test(e.label || e.value || e)
            })
        }
    }), e.widget("ui.autocomplete", e.ui.autocomplete, {
        options: {
            messages: {
                noResults: "No search results.",
                results: function (e) {
                    return e + (e > 1 ? " results are" : " result is") + " available, use up and down arrow keys to navigate."
                }
            }
        }, __response: function (e) {
            var t;
            this._superApply(arguments), this.options.disabled || this.cancelSearch || (t = e && e.length ? this.options.messages.results(e.length) : this.options.messages.noResults, this.liveRegion.text(t))
        }
    })
})(jQuery);
(function (e) {
    e.widget("ui.menu", {
        version: "1.10.3",
        defaultElement: "<ul>",
        delay: 300,
        options: {
            icons: {submenu: "ui-icon-carat-1-e"},
            menus: "ul",
            position: {my: "left top", at: "right top"},
            role: "menu",
            blur: null,
            focus: null,
            select: null
        },
        _create: function () {
            this.activeMenu = this.element, this.mouseHandled = !1, this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length).attr({
                role: this.options.role,
                tabIndex: 0
            }).bind("click" + this.eventNamespace, e.proxy(function (e) {
                this.options.disabled && e.preventDefault()
            }, this)), this.options.disabled && this.element.addClass("ui-state-disabled").attr("aria-disabled", "true"), this._on({
                "mousedown .ui-menu-item > a": function (e) {
                    e.preventDefault()
                }, "click .ui-state-disabled > a": function (e) {
                    e.preventDefault()
                }, "click .ui-menu-item:has(a)": function (t) {
                    var i = e(t.target).closest(".ui-menu-item");
                    !this.mouseHandled && i.not(".ui-state-disabled").length && (this.mouseHandled = !0, this.select(t), i.has(".ui-menu").length ? this.expand(t) : this.element.is(":focus") || (this.element.trigger("focus", [!0]), this.active && 1 === this.active.parents(".ui-menu").length && clearTimeout(this.timer)))
                }, "mouseenter .ui-menu-item": function (t) {
                    var i = e(t.currentTarget);
                    i.siblings().children(".ui-state-active").removeClass("ui-state-active"), this.focus(t, i)
                }, mouseleave: "collapseAll", "mouseleave .ui-menu": "collapseAll", focus: function (e, t) {
                    var i = this.active || this.element.children(".ui-menu-item").eq(0);
                    t || this.focus(e, i)
                }, blur: function (t) {
                    this._delay(function () {
                        e.contains(this.element[0], this.document[0].activeElement) || this.collapseAll(t)
                    })
                }, keydown: "_keydown"
            }), this.refresh(), this._on(this.document, {
                click: function (t) {
                    e(t.target).closest(".ui-menu").length || this.collapseAll(t), this.mouseHandled = !1
                }
            })
        },
        _destroy: function () {
            this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(), this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function () {
                var t = e(this);
                t.data("ui-menu-submenu-carat") && t.remove()
            }), this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")
        },
        _keydown: function (t) {
            function i(e) {
                return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
            }

            var s, a, n, r, o, h = !0;
            switch (t.keyCode) {
                case e.ui.keyCode.PAGE_UP:
                    this.previousPage(t);
                    break;
                case e.ui.keyCode.PAGE_DOWN:
                    this.nextPage(t);
                    break;
                case e.ui.keyCode.HOME:
                    this._move("first", "first", t);
                    break;
                case e.ui.keyCode.END:
                    this._move("last", "last", t);
                    break;
                case e.ui.keyCode.UP:
                    this.previous(t);
                    break;
                case e.ui.keyCode.DOWN:
                    this.next(t);
                    break;
                case e.ui.keyCode.LEFT:
                    this.collapse(t);
                    break;
                case e.ui.keyCode.RIGHT:
                    this.active && !this.active.is(".ui-state-disabled") && this.expand(t);
                    break;
                case e.ui.keyCode.ENTER:
                case e.ui.keyCode.SPACE:
                    this._activate(t);
                    break;
                case e.ui.keyCode.ESCAPE:
                    this.collapse(t);
                    break;
                default:
                    h = !1, a = this.previousFilter || "", n = String.fromCharCode(t.keyCode), r = !1, clearTimeout(this.filterTimer), n === a ? r = !0 : n = a + n, o = RegExp("^" + i(n), "i"), s = this.activeMenu.children(".ui-menu-item").filter(function () {
                        return o.test(e(this).children("a").text())
                    }), s = r && -1 !== s.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : s, s.length || (n = String.fromCharCode(t.keyCode), o = RegExp("^" + i(n), "i"), s = this.activeMenu.children(".ui-menu-item").filter(function () {
                        return o.test(e(this).children("a").text())
                    })), s.length ? (this.focus(t, s), s.length > 1 ? (this.previousFilter = n, this.filterTimer = this._delay(function () {
                        delete this.previousFilter
                    }, 1e3)) : delete this.previousFilter) : delete this.previousFilter
            }
            h && t.preventDefault()
        },
        _activate: function (e) {
            this.active.is(".ui-state-disabled") || (this.active.children("a[aria-haspopup='true']").length ? this.expand(e) : this.select(e))
        },
        refresh: function () {
            var t, i = this.options.icons.submenu, s = this.element.find(this.options.menus);
            s.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({
                role: this.options.role,
                "aria-hidden": "true",
                "aria-expanded": "false"
            }).each(function () {
                var t = e(this), s = t.prev("a"),
                    a = e("<span>").addClass("ui-menu-icon ui-icon " + i).data("ui-menu-submenu-carat", !0);
                s.attr("aria-haspopup", "true").prepend(a), t.attr("aria-labelledby", s.attr("id"))
            }), t = s.add(this.element), t.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "presentation").children("a").uniqueId().addClass("ui-corner-all").attr({
                tabIndex: -1,
                role: this._itemRole()
            }), t.children(":not(.ui-menu-item)").each(function () {
                var t = e(this);
                /[^\-\u2014\u2013\s]/.test(t.text()) || t.addClass("ui-widget-content ui-menu-divider")
            }), t.children(".ui-state-disabled").attr("aria-disabled", "true"), this.active && !e.contains(this.element[0], this.active[0]) && this.blur()
        },
        _itemRole: function () {
            return {menu: "menuitem", listbox: "option"}[this.options.role]
        },
        _setOption: function (e, t) {
            "icons" === e && this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(t.submenu), this._super(e, t)
        },
        focus: function (e, t) {
            var i, s;
            this.blur(e, e && "focus" === e.type), this._scrollIntoView(t), this.active = t.first(), s = this.active.children("a").addClass("ui-state-focus"), this.options.role && this.element.attr("aria-activedescendant", s.attr("id")), this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"), e && "keydown" === e.type ? this._close() : this.timer = this._delay(function () {
                this._close()
            }, this.delay), i = t.children(".ui-menu"), i.length && /^mouse/.test(e.type) && this._startOpening(i), this.activeMenu = t.parent(), this._trigger("focus", e, {item: t})
        },
        _scrollIntoView: function (t) {
            var i, s, a, n, r, o;
            this._hasScroll() && (i = parseFloat(e.css(this.activeMenu[0], "borderTopWidth")) || 0, s = parseFloat(e.css(this.activeMenu[0], "paddingTop")) || 0, a = t.offset().top - this.activeMenu.offset().top - i - s, n = this.activeMenu.scrollTop(), r = this.activeMenu.height(), o = t.height(), 0 > a ? this.activeMenu.scrollTop(n + a) : a + o > r && this.activeMenu.scrollTop(n + a - r + o))
        },
        blur: function (e, t) {
            t || clearTimeout(this.timer), this.active && (this.active.children("a").removeClass("ui-state-focus"), this.active = null, this._trigger("blur", e, {item: this.active}))
        },
        _startOpening: function (e) {
            clearTimeout(this.timer), "true" === e.attr("aria-hidden") && (this.timer = this._delay(function () {
                this._close(), this._open(e)
            }, this.delay))
        },
        _open: function (t) {
            var i = e.extend({of: this.active}, this.options.position);
            clearTimeout(this.timer), this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden", "true"), t.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(i)
        },
        collapseAll: function (t, i) {
            clearTimeout(this.timer), this.timer = this._delay(function () {
                var s = i ? this.element : e(t && t.target).closest(this.element.find(".ui-menu"));
                s.length || (s = this.element), this._close(s), this.blur(t), this.activeMenu = s
            }, this.delay)
        },
        _close: function (e) {
            e || (e = this.active ? this.active.parent() : this.element), e.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find("a.ui-state-active").removeClass("ui-state-active")
        },
        collapse: function (e) {
            var t = this.active && this.active.parent().closest(".ui-menu-item", this.element);
            t && t.length && (this._close(), this.focus(e, t))
        },
        expand: function (e) {
            var t = this.active && this.active.children(".ui-menu ").children(".ui-menu-item").first();
            t && t.length && (this._open(t.parent()), this._delay(function () {
                this.focus(e, t)
            }))
        },
        next: function (e) {
            this._move("next", "first", e)
        },
        previous: function (e) {
            this._move("prev", "last", e)
        },
        isFirstItem: function () {
            return this.active && !this.active.prevAll(".ui-menu-item").length
        },
        isLastItem: function () {
            return this.active && !this.active.nextAll(".ui-menu-item").length
        },
        _move: function (e, t, i) {
            var s;
            this.active && (s = "first" === e || "last" === e ? this.active["first" === e ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[e + "All"](".ui-menu-item").eq(0)), s && s.length && this.active || (s = this.activeMenu.children(".ui-menu-item")[t]()), this.focus(i, s)
        },
        nextPage: function (t) {
            var i, s, a;
            return this.active ? (this.isLastItem() || (this._hasScroll() ? (s = this.active.offset().top, a = this.element.height(), this.active.nextAll(".ui-menu-item").each(function () {
                return i = e(this), 0 > i.offset().top - s - a
            }), this.focus(t, i)) : this.focus(t, this.activeMenu.children(".ui-menu-item")[this.active ? "last" : "first"]())), undefined) : (this.next(t), undefined)
        },
        previousPage: function (t) {
            var i, s, a;
            return this.active ? (this.isFirstItem() || (this._hasScroll() ? (s = this.active.offset().top, a = this.element.height(), this.active.prevAll(".ui-menu-item").each(function () {
                return i = e(this), i.offset().top - s + a > 0
            }), this.focus(t, i)) : this.focus(t, this.activeMenu.children(".ui-menu-item").first())), undefined) : (this.next(t), undefined)
        },
        _hasScroll: function () {
            return this.element.outerHeight() < this.element.prop("scrollHeight")
        },
        select: function (t) {
            this.active = this.active || e(t.target).closest(".ui-menu-item");
            var i = {item: this.active};
            this.active.has(".ui-menu").length || this.collapseAll(t, !0), this._trigger("select", t, i)
        }
    })
})(jQuery);
(function (e, t) {
    var i = "ui-effects-";
    e.effects = {effect: {}}, function (e, t) {
        function i(e, t, i) {
            var s = c[t.type] || {};
            return null == e ? i || !t.def ? null : t.def : (e = s.floor ? ~~e : parseFloat(e), isNaN(e) ? t.def : s.mod ? (e + s.mod) % s.mod : 0 > e ? 0 : e > s.max ? s.max : e)
        }

        function s(i) {
            var s = l(), a = s._rgba = [];
            return i = i.toLowerCase(), f(h, function (e, n) {
                var r, o = n.re.exec(i), h = o && n.parse(o), l = n.space || "rgba";
                return h ? (r = s[l](h), s[u[l].cache] = r[u[l].cache], a = s._rgba = r._rgba, !1) : t
            }), a.length ? ("0,0,0,0" === a.join() && e.extend(a, n.transparent), s) : n[i]
        }

        function a(e, t, i) {
            return i = (i + 1) % 1, 1 > 6 * i ? e + 6 * (t - e) * i : 1 > 2 * i ? t : 2 > 3 * i ? e + 6 * (t - e) * (2 / 3 - i) : e
        }

        var n,
            r = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
            o = /^([\-+])=\s*(\d+\.?\d*)/, h = [{
                re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                parse: function (e) {
                    return [e[1], e[2], e[3], e[4]]
                }
            }, {
                re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                parse: function (e) {
                    return [2.55 * e[1], 2.55 * e[2], 2.55 * e[3], e[4]]
                }
            }, {
                re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/, parse: function (e) {
                    return [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)]
                }
            }, {
                re: /#([a-f0-9])([a-f0-9])([a-f0-9])/, parse: function (e) {
                    return [parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16)]
                }
            }, {
                re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                space: "hsla",
                parse: function (e) {
                    return [e[1], e[2] / 100, e[3] / 100, e[4]]
                }
            }], l = e.Color = function (t, i, s, a) {
                return new e.Color.fn.parse(t, i, s, a)
            }, u = {
                rgba: {
                    props: {
                        red: {idx: 0, type: "byte"},
                        green: {idx: 1, type: "byte"},
                        blue: {idx: 2, type: "byte"}
                    }
                },
                hsla: {
                    props: {
                        hue: {idx: 0, type: "degrees"},
                        saturation: {idx: 1, type: "percent"},
                        lightness: {idx: 2, type: "percent"}
                    }
                }
            }, c = {"byte": {floor: !0, max: 255}, percent: {max: 1}, degrees: {mod: 360, floor: !0}}, d = l.support = {},
            p = e("<p>")[0], f = e.each;
        p.style.cssText = "background-color:rgba(1,1,1,.5)", d.rgba = p.style.backgroundColor.indexOf("rgba") > -1, f(u, function (e, t) {
            t.cache = "_" + e, t.props.alpha = {idx: 3, type: "percent", def: 1}
        }), l.fn = e.extend(l.prototype, {
            parse: function (a, r, o, h) {
                if (a === t) return this._rgba = [null, null, null, null], this;
                (a.jquery || a.nodeType) && (a = e(a).css(r), r = t);
                var c = this, d = e.type(a), p = this._rgba = [];
                return r !== t && (a = [a, r, o, h], d = "array"), "string" === d ? this.parse(s(a) || n._default) : "array" === d ? (f(u.rgba.props, function (e, t) {
                    p[t.idx] = i(a[t.idx], t)
                }), this) : "object" === d ? (a instanceof l ? f(u, function (e, t) {
                    a[t.cache] && (c[t.cache] = a[t.cache].slice())
                }) : f(u, function (t, s) {
                    var n = s.cache;
                    f(s.props, function (e, t) {
                        if (!c[n] && s.to) {
                            if ("alpha" === e || null == a[e]) return;
                            c[n] = s.to(c._rgba)
                        }
                        c[n][t.idx] = i(a[e], t, !0)
                    }), c[n] && 0 > e.inArray(null, c[n].slice(0, 3)) && (c[n][3] = 1, s.from && (c._rgba = s.from(c[n])))
                }), this) : t
            }, is: function (e) {
                var i = l(e), s = !0, a = this;
                return f(u, function (e, n) {
                    var r, o = i[n.cache];
                    return o && (r = a[n.cache] || n.to && n.to(a._rgba) || [], f(n.props, function (e, i) {
                        return null != o[i.idx] ? s = o[i.idx] === r[i.idx] : t
                    })), s
                }), s
            }, _space: function () {
                var e = [], t = this;
                return f(u, function (i, s) {
                    t[s.cache] && e.push(i)
                }), e.pop()
            }, transition: function (e, t) {
                var s = l(e), a = s._space(), n = u[a], r = 0 === this.alpha() ? l("transparent") : this,
                    o = r[n.cache] || n.to(r._rgba), h = o.slice();
                return s = s[n.cache], f(n.props, function (e, a) {
                    var n = a.idx, r = o[n], l = s[n], u = c[a.type] || {};
                    null !== l && (null === r ? h[n] = l : (u.mod && (l - r > u.mod / 2 ? r += u.mod : r - l > u.mod / 2 && (r -= u.mod)), h[n] = i((l - r) * t + r, a)))
                }), this[a](h)
            }, blend: function (t) {
                if (1 === this._rgba[3]) return this;
                var i = this._rgba.slice(), s = i.pop(), a = l(t)._rgba;
                return l(e.map(i, function (e, t) {
                    return (1 - s) * a[t] + s * e
                }))
            }, toRgbaString: function () {
                var t = "rgba(", i = e.map(this._rgba, function (e, t) {
                    return null == e ? t > 2 ? 1 : 0 : e
                });
                return 1 === i[3] && (i.pop(), t = "rgb("), t + i.join() + ")"
            }, toHslaString: function () {
                var t = "hsla(", i = e.map(this.hsla(), function (e, t) {
                    return null == e && (e = t > 2 ? 1 : 0), t && 3 > t && (e = Math.round(100 * e) + "%"), e
                });
                return 1 === i[3] && (i.pop(), t = "hsl("), t + i.join() + ")"
            }, toHexString: function (t) {
                var i = this._rgba.slice(), s = i.pop();
                return t && i.push(~~(255 * s)), "#" + e.map(i, function (e) {
                    return e = (e || 0).toString(16), 1 === e.length ? "0" + e : e
                }).join("")
            }, toString: function () {
                return 0 === this._rgba[3] ? "transparent" : this.toRgbaString()
            }
        }), l.fn.parse.prototype = l.fn, u.hsla.to = function (e) {
            if (null == e[0] || null == e[1] || null == e[2]) return [null, null, null, e[3]];
            var t, i, s = e[0] / 255, a = e[1] / 255, n = e[2] / 255, r = e[3], o = Math.max(s, a, n),
                h = Math.min(s, a, n), l = o - h, u = o + h, c = .5 * u;
            return t = h === o ? 0 : s === o ? 60 * (a - n) / l + 360 : a === o ? 60 * (n - s) / l + 120 : 60 * (s - a) / l + 240, i = 0 === l ? 0 : .5 >= c ? l / u : l / (2 - u), [Math.round(t) % 360, i, c, null == r ? 1 : r]
        }, u.hsla.from = function (e) {
            if (null == e[0] || null == e[1] || null == e[2]) return [null, null, null, e[3]];
            var t = e[0] / 360, i = e[1], s = e[2], n = e[3], r = .5 >= s ? s * (1 + i) : s + i - s * i, o = 2 * s - r;
            return [Math.round(255 * a(o, r, t + 1 / 3)), Math.round(255 * a(o, r, t)), Math.round(255 * a(o, r, t - 1 / 3)), n]
        }, f(u, function (s, a) {
            var n = a.props, r = a.cache, h = a.to, u = a.from;
            l.fn[s] = function (s) {
                if (h && !this[r] && (this[r] = h(this._rgba)), s === t) return this[r].slice();
                var a, o = e.type(s), c = "array" === o || "object" === o ? s : arguments, d = this[r].slice();
                return f(n, function (e, t) {
                    var s = c["object" === o ? e : t.idx];
                    null == s && (s = d[t.idx]), d[t.idx] = i(s, t)
                }), u ? (a = l(u(d)), a[r] = d, a) : l(d)
            }, f(n, function (t, i) {
                l.fn[t] || (l.fn[t] = function (a) {
                    var n, r = e.type(a), h = "alpha" === t ? this._hsla ? "hsla" : "rgba" : s, l = this[h](),
                        u = l[i.idx];
                    return "undefined" === r ? u : ("function" === r && (a = a.call(this, u), r = e.type(a)), null == a && i.empty ? this : ("string" === r && (n = o.exec(a), n && (a = u + parseFloat(n[2]) * ("+" === n[1] ? 1 : -1))), l[i.idx] = a, this[h](l)))
                })
            })
        }), l.hook = function (t) {
            var i = t.split(" ");
            f(i, function (t, i) {
                e.cssHooks[i] = {
                    set: function (t, a) {
                        var n, r, o = "";
                        if ("transparent" !== a && ("string" !== e.type(a) || (n = s(a)))) {
                            if (a = l(n || a), !d.rgba && 1 !== a._rgba[3]) {
                                for (r = "backgroundColor" === i ? t.parentNode : t; ("" === o || "transparent" === o) && r && r.style;) try {
                                    o = e.css(r, "backgroundColor"), r = r.parentNode
                                } catch (h) {
                                }
                                a = a.blend(o && "transparent" !== o ? o : "_default")
                            }
                            a = a.toRgbaString()
                        }
                        try {
                            t.style[i] = a
                        } catch (h) {
                        }
                    }
                }, e.fx.step[i] = function (t) {
                    t.colorInit || (t.start = l(t.elem, i), t.end = l(t.end), t.colorInit = !0), e.cssHooks[i].set(t.elem, t.start.transition(t.end, t.pos))
                }
            })
        }, l.hook(r), e.cssHooks.borderColor = {
            expand: function (e) {
                var t = {};
                return f(["Top", "Right", "Bottom", "Left"], function (i, s) {
                    t["border" + s + "Color"] = e
                }), t
            }
        }, n = e.Color.names = {
            aqua: "#00ffff",
            black: "#000000",
            blue: "#0000ff",
            fuchsia: "#ff00ff",
            gray: "#808080",
            green: "#008000",
            lime: "#00ff00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            purple: "#800080",
            red: "#ff0000",
            silver: "#c0c0c0",
            teal: "#008080",
            white: "#ffffff",
            yellow: "#ffff00",
            transparent: [null, null, null, 0],
            _default: "#ffffff"
        }
    }(jQuery), function () {
        function i(t) {
            var i, s,
                a = t.ownerDocument.defaultView ? t.ownerDocument.defaultView.getComputedStyle(t, null) : t.currentStyle,
                n = {};
            if (a && a.length && a[0] && a[a[0]]) for (s = a.length; s--;) i = a[s], "string" == typeof a[i] && (n[e.camelCase(i)] = a[i]); else for (i in a) "string" == typeof a[i] && (n[i] = a[i]);
            return n
        }

        function s(t, i) {
            var s, a, r = {};
            for (s in i) a = i[s], t[s] !== a && (n[s] || (e.fx.step[s] || !isNaN(parseFloat(a))) && (r[s] = a));
            return r
        }

        var a = ["add", "remove", "toggle"], n = {
            border: 1,
            borderBottom: 1,
            borderColor: 1,
            borderLeft: 1,
            borderRight: 1,
            borderTop: 1,
            borderWidth: 1,
            margin: 1,
            padding: 1
        };
        e.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function (t, i) {
            e.fx.step[i] = function (e) {
                ("none" !== e.end && !e.setAttr || 1 === e.pos && !e.setAttr) && (jQuery.style(e.elem, i, e.end), e.setAttr = !0)
            }
        }), e.fn.addBack || (e.fn.addBack = function (e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }), e.effects.animateClass = function (t, n, r, o) {
            var h = e.speed(n, r, o);
            return this.queue(function () {
                var n, r = e(this), o = r.attr("class") || "", l = h.children ? r.find("*").addBack() : r;
                l = l.map(function () {
                    var t = e(this);
                    return {el: t, start: i(this)}
                }), n = function () {
                    e.each(a, function (e, i) {
                        t[i] && r[i + "Class"](t[i])
                    })
                }, n(), l = l.map(function () {
                    return this.end = i(this.el[0]), this.diff = s(this.start, this.end), this
                }), r.attr("class", o), l = l.map(function () {
                    var t = this, i = e.Deferred(), s = e.extend({}, h, {
                        queue: !1, complete: function () {
                            i.resolve(t)
                        }
                    });
                    return this.el.animate(this.diff, s), i.promise()
                }), e.when.apply(e, l.get()).done(function () {
                    n(), e.each(arguments, function () {
                        var t = this.el;
                        e.each(this.diff, function (e) {
                            t.css(e, "")
                        })
                    }), h.complete.call(r[0])
                })
            })
        }, e.fn.extend({
            addClass: function (t) {
                return function (i, s, a, n) {
                    return s ? e.effects.animateClass.call(this, {add: i}, s, a, n) : t.apply(this, arguments)
                }
            }(e.fn.addClass), removeClass: function (t) {
                return function (i, s, a, n) {
                    return arguments.length > 1 ? e.effects.animateClass.call(this, {remove: i}, s, a, n) : t.apply(this, arguments)
                }
            }(e.fn.removeClass), toggleClass: function (i) {
                return function (s, a, n, r, o) {
                    return "boolean" == typeof a || a === t ? n ? e.effects.animateClass.call(this, a ? {add: s} : {remove: s}, n, r, o) : i.apply(this, arguments) : e.effects.animateClass.call(this, {toggle: s}, a, n, r)
                }
            }(e.fn.toggleClass), switchClass: function (t, i, s, a, n) {
                return e.effects.animateClass.call(this, {add: i, remove: t}, s, a, n)
            }
        })
    }(), function () {
        function s(t, i, s, a) {
            return e.isPlainObject(t) && (i = t, t = t.effect), t = {effect: t}, null == i && (i = {}), e.isFunction(i) && (a = i, s = null, i = {}), ("number" == typeof i || e.fx.speeds[i]) && (a = s, s = i, i = {}), e.isFunction(s) && (a = s, s = null), i && e.extend(t, i), s = s || i.duration, t.duration = e.fx.off ? 0 : "number" == typeof s ? s : s in e.fx.speeds ? e.fx.speeds[s] : e.fx.speeds._default, t.complete = a || i.complete, t
        }

        function a(t) {
            return !t || "number" == typeof t || e.fx.speeds[t] ? !0 : "string" != typeof t || e.effects.effect[t] ? e.isFunction(t) ? !0 : "object" != typeof t || t.effect ? !1 : !0 : !0
        }

        e.extend(e.effects, {
            version: "1.10.3", save: function (e, t) {
                for (var s = 0; t.length > s; s++) null !== t[s] && e.data(i + t[s], e[0].style[t[s]])
            }, restore: function (e, s) {
                var a, n;
                for (n = 0; s.length > n; n++) null !== s[n] && (a = e.data(i + s[n]), a === t && (a = ""), e.css(s[n], a))
            }, setMode: function (e, t) {
                return "toggle" === t && (t = e.is(":hidden") ? "show" : "hide"), t
            }, getBaseline: function (e, t) {
                var i, s;
                switch (e[0]) {
                    case"top":
                        i = 0;
                        break;
                    case"middle":
                        i = .5;
                        break;
                    case"bottom":
                        i = 1;
                        break;
                    default:
                        i = e[0] / t.height
                }
                switch (e[1]) {
                    case"left":
                        s = 0;
                        break;
                    case"center":
                        s = .5;
                        break;
                    case"right":
                        s = 1;
                        break;
                    default:
                        s = e[1] / t.width
                }
                return {x: s, y: i}
            }, createWrapper: function (t) {
                if (t.parent().is(".ui-effects-wrapper")) return t.parent();
                var i = {width: t.outerWidth(!0), height: t.outerHeight(!0), "float": t.css("float")},
                    s = e("<div></div>").addClass("ui-effects-wrapper").css({
                        fontSize: "100%",
                        background: "transparent",
                        border: "none",
                        margin: 0,
                        padding: 0
                    }), a = {width: t.width(), height: t.height()}, n = document.activeElement;
                try {
                    n.id
                } catch (r) {
                    n = document.body
                }
                return t.wrap(s), (t[0] === n || e.contains(t[0], n)) && e(n).focus(), s = t.parent(), "static" === t.css("position") ? (s.css({position: "relative"}), t.css({position: "relative"})) : (e.extend(i, {
                    position: t.css("position"),
                    zIndex: t.css("z-index")
                }), e.each(["top", "left", "bottom", "right"], function (e, s) {
                    i[s] = t.css(s), isNaN(parseInt(i[s], 10)) && (i[s] = "auto")
                }), t.css({
                    position: "relative",
                    top: 0,
                    left: 0,
                    right: "auto",
                    bottom: "auto"
                })), t.css(a), s.css(i).show()
            }, removeWrapper: function (t) {
                var i = document.activeElement;
                return t.parent().is(".ui-effects-wrapper") && (t.parent().replaceWith(t), (t[0] === i || e.contains(t[0], i)) && e(i).focus()), t
            }, setTransition: function (t, i, s, a) {
                return a = a || {}, e.each(i, function (e, i) {
                    var n = t.cssUnit(i);
                    n[0] > 0 && (a[i] = n[0] * s + n[1])
                }), a
            }
        }), e.fn.extend({
            effect: function () {
                function t(t) {
                    function s() {
                        e.isFunction(n) && n.call(a[0]), e.isFunction(t) && t()
                    }

                    var a = e(this), n = i.complete, o = i.mode;
                    (a.is(":hidden") ? "hide" === o : "show" === o) ? (a[o](), s()) : r.call(a[0], i, s)
                }

                var i = s.apply(this, arguments), a = i.mode, n = i.queue, r = e.effects.effect[i.effect];
                return e.fx.off || !r ? a ? this[a](i.duration, i.complete) : this.each(function () {
                    i.complete && i.complete.call(this)
                }) : n === !1 ? this.each(t) : this.queue(n || "fx", t)
            }, show: function (e) {
                return function (t) {
                    if (a(t)) return e.apply(this, arguments);
                    var i = s.apply(this, arguments);
                    return i.mode = "show", this.effect.call(this, i)
                }
            }(e.fn.show), hide: function (e) {
                return function (t) {
                    if (a(t)) return e.apply(this, arguments);
                    var i = s.apply(this, arguments);
                    return i.mode = "hide", this.effect.call(this, i)
                }
            }(e.fn.hide), toggle: function (e) {
                return function (t) {
                    if (a(t) || "boolean" == typeof t) return e.apply(this, arguments);
                    var i = s.apply(this, arguments);
                    return i.mode = "toggle", this.effect.call(this, i)
                }
            }(e.fn.toggle), cssUnit: function (t) {
                var i = this.css(t), s = [];
                return e.each(["em", "px", "%", "pt"], function (e, t) {
                    i.indexOf(t) > 0 && (s = [parseFloat(i), t])
                }), s
            }
        })
    }(), function () {
        var t = {};
        e.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (e, i) {
            t[i] = function (t) {
                return Math.pow(t, e + 2)
            }
        }), e.extend(t, {
            Sine: function (e) {
                return 1 - Math.cos(e * Math.PI / 2)
            }, Circ: function (e) {
                return 1 - Math.sqrt(1 - e * e)
            }, Elastic: function (e) {
                return 0 === e || 1 === e ? e : -Math.pow(2, 8 * (e - 1)) * Math.sin((80 * (e - 1) - 7.5) * Math.PI / 15)
            }, Back: function (e) {
                return e * e * (3 * e - 2)
            }, Bounce: function (e) {
                for (var t, i = 4; ((t = Math.pow(2, --i)) - 1) / 11 > e;) ;
                return 1 / Math.pow(4, 3 - i) - 7.5625 * Math.pow((3 * t - 2) / 22 - e, 2)
            }
        }), e.each(t, function (t, i) {
            e.easing["easeIn" + t] = i, e.easing["easeOut" + t] = function (e) {
                return 1 - i(1 - e)
            }, e.easing["easeInOut" + t] = function (e) {
                return .5 > e ? i(2 * e) / 2 : 1 - i(-2 * e + 2) / 2
            }
        })
    }()
})(jQuery);
(function (e) {
    e.effects.effect.highlight = function (t, i) {
        var s = e(this), a = ["backgroundImage", "backgroundColor", "opacity"],
            n = e.effects.setMode(s, t.mode || "show"), r = {backgroundColor: s.css("backgroundColor")};
        "hide" === n && (r.opacity = 0), e.effects.save(s, a), s.show().css({
            backgroundImage: "none",
            backgroundColor: t.color || "#ffff99"
        }).animate(r, {
            queue: !1, duration: t.duration, easing: t.easing, complete: function () {
                "hide" === n && s.hide(), e.effects.restore(s, a), i()
            }
        })
    }
})(jQuery);

var globalContextRoot;
$(function () {
    var $sok = $('#sok');
    var $sokeForm = $('.sokeForm');
    $sok.autocomplete({
        appendTo: $sok.parent(), source: function (request, response) {
            $.getJSON(globalContextRoot + '/autocomplete.json', {term: request.term}, response)
        }, minLength: 2, messages: {
            noResults: '', results: function () {
            }
        }, select: function (event, ui) {
            $sok.val(ui.item.value);
            $sokeForm.submit();
        }
    });
    $('#knappers').click(function () {
        $sokeForm.submit();
    });
});

function setContextRoot(contextRoot) {
    globalContextRoot = contextRoot;
}

var navno = navno || {};
navno.buttonBottomOffset = null;
navno.topLinkButtonPlaceholder = null;
navno.topLinkStickyElement = null;
navno.requiredScrollDistanceForSticky = null;
navno.onScrollAndResize = function () {
    var viewPortBottom = $(document).scrollTop() + $(window).height();
    var isBelowPageHeader = ($(document).scrollTop() > navno.requiredScrollDistanceForSticky);
    if (isBelowPageHeader && (navno.buttonBottomOffset > viewPortBottom) && !navno.topLinkStickyElement.hasClass("sticky-top-link")) {
        navno.topLinkStickyElement.addClass('sticky-top-link');
    } else if (isBelowPageHeader && (navno.buttonBottomOffset < viewPortBottom) && navno.topLinkStickyElement.hasClass("sticky-top-link")) {
        navno.topLinkStickyElement.removeClass('sticky-top-link');
    } else if (!isBelowPageHeader && navno.topLinkStickyElement.hasClass("sticky-top-link")) {
        navno.topLinkStickyElement.removeClass('sticky-top-link');
    }
};
$(function () {
    navno.topLinkButtonPlaceholder = $('.placeholder');
    navno.topLinkStickyElement = $('#top-scroll-link').parent();
    navno.requiredScrollDistanceForSticky = ($("header.siteheader").height() + 600);
    var footerMenuTop = $('#footer-content-menu').offset().top;
    if (($(window).height() * 2) + 200 < footerMenuTop) {
        navno.topLinkStickyElement.removeClass("hide-on-pageload");
        $(".placeholder").css("height", navno.topLinkButtonPlaceholder.height());
        navno.buttonBottomOffset = navno.topLinkButtonPlaceholder.offset().top + navno.topLinkButtonPlaceholder.height();
        if ($(document).scrollTop() > navno.requiredScrollDistanceForSticky && ($(document).scrollTop() + $(window).height()) < footerMenuTop) {
            navno.topLinkStickyElement.addClass('sticky-top-link');
        }
        $(document).on("scroll", navno.onScrollAndResize);
        if (!('ontouchstart' in document.documentElement)) {
            $(window).on("resize", function onResize() {
                var thisWindow = $(window);
                thisWindow.off("resize");
                navno.buttonBottomOffset = navno.topLinkButtonPlaceholder.offset().top + navno.topLinkButtonPlaceholder.height();
                navno['onScrollAndResize']();
                setTimeout(function () {
                    navno.buttonBottomOffset = navno.topLinkButtonPlaceholder.offset().top + navno.topLinkButtonPlaceholder.height();
                    navno['onScrollAndResize']();
                    thisWindow.on("resize", onResize);
                }, 2000);
            });
        }
        if ('ontouchstart' in document.documentElement) {
            var onOrientationChange = function (e) {
                e.stopPropagation();
                setTimeout(function () {
                    navno.buttonBottomOffset = navno.topLinkButtonPlaceholder.offset().top + navno.topLinkButtonPlaceholder.height();
                    navno['onScrollAndResize']();
                }, 500);
            };
            $(window).on("resize", onOrientationChange);
            $(document).on("touchmove", navno.onScrollAndResize);
        }
    }
});
$(function () {
    $('#top-scroll-link').on("click", function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: $('#page-top').offset().top}, {duration: 250});
        setSearchResultFocusAndScroll(0);
    });
});

function settPosisjonPaaKnapp() {
    var footerMenuTop = $('#footer-content-menu').offset().top;
    if (($(window).height() * 2) + 200 > footerMenuTop) {
        navno.topLinkStickyElement.addClass("hide-on-pageload");
    } else {
        navno.topLinkStickyElement.removeClass("hide-on-pageload");
    }
    navno.buttonBottomOffset = navno.topLinkButtonPlaceholder.offset().top + navno.topLinkButtonPlaceholder.height();
    navno["onScrollAndResize"]();
}

function defaultFasettSkalIkkeKunneKlikkesPaaOmFasettenErValgt() {
    $('.defaultFasett.erValgt').click(function (e) {
        e.preventDefault();
    });
}

function setSearchResultFocusAndScroll(fokusIndex) {
    var lenker = $('.sokeresultatliste li.postnummersok div, .sokeresultatliste a');
    if (fokusIndex > 0) {
        var topp = Number($(lenker[fokusIndex]).position().top);
        $('html,body').animate({scrollTop: topp}, 500);
    }
}

function controlRadioBehavior(e) {
    var $actelm = $(document.activeElement);
    if ($actelm.parent('.utvidbar').length > 0) {
        e.preventDefault();
        var choices = $('.utvidbar > input[type=radio]:enabled');
        iterateChoices(e.keyCode, choices);
    } else if ($actelm.parents('.fasettListe').length > 0) {
        e.preventDefault();
        choices = $('.fasettListe.tid input[type=radio]:enabled');
        iterateChoices(e.keyCode, choices);
    }
}

function iterateChoices(keyCode, choices) {
    var actelm = document.activeElement;
    for (var i = 0; i < choices.length; i++) {
        if (choices[i] === actelm) {
            if (keyCode === 38) {
                $(choices[i - 1]).focus();
            } else if (keyCode === 40) {
                $(choices[i + 1]).focus();
            }
            break;
        }
    }
}

function toggleChecked($actelm) {
    var checked = $actelm.attr('checked');
    if (checked === undefined) {
        checked = '';
    }
    if (checked === '') {
        checked = 'checked';
    } else {
        checked = '';
    }
    return checked;
}

function switchKeys(e) {
    switch (e.keyCode) {
        case 13:
            var $actelm = $(document.activeElement);
            if ($actelm.parent('.utvidbar')) {
                $actelm.attr('checked', toggleChecked($actelm));
                $($actelm.parents('form')[0]).submit();
            }
            break;
        case 38:
            controlRadioBehavior(e);
            break;
        case 40:
            controlRadioBehavior(e);
            break;
    }
}

$(function () {
    scrollToTopHandler();
    $(window).keydown(function (e) {
        switchKeys(e);
    });
});
(function (a) {
    if (typeof (Wicket) === "undefined") {
        window.Wicket = {}
    }
    if (typeof (Wicket.Event) === "object") {
        return
    }
    jQuery.extend(true, Wicket, {
        Browser: {
            isKHTML: function () {
                return (/Konqueror|KHTML/).test(window.navigator.userAgent) && !/Apple/.test(window.navigator.userAgent)
            }, isSafari: function () {
                return !/Chrome/.test(window.navigator.userAgent) && /KHTML/.test(window.navigator.userAgent) && /Apple/.test(window.navigator.userAgent)
            }, isChrome: function () {
                return (/KHTML/).test(window.navigator.userAgent) && /Apple/.test(window.navigator.userAgent) && /Chrome/.test(window.navigator.userAgent)
            }, isOpera: function () {
                return !Wicket.Browser.isSafari() && typeof (window.opera) !== "undefined"
            }, isIE: function () {
                return !Wicket.Browser.isSafari() && (typeof (document.all) !== "undefined" || window.navigator.userAgent.indexOf("Trident/") > -1) && typeof (window.opera) === "undefined"
            }, isIEQuirks: function () {
                return Wicket.Browser.isIE() && window.document.documentElement.clientHeight === 0
            }, isIELessThan7: function () {
                var c = window.navigator.userAgent.indexOf("MSIE");
                var b = parseFloat(window.navigator.userAgent.substring(c + 5));
                return Wicket.Browser.isIE() && b < 7
            }, isIE7: function () {
                var c = window.navigator.userAgent.indexOf("MSIE");
                var b = parseFloat(window.navigator.userAgent.substring(c + 5));
                return Wicket.Browser.isIE() && b >= 7
            }, isIELessThan9: function () {
                var c = window.navigator.userAgent.indexOf("MSIE");
                var b = parseFloat(window.navigator.userAgent.substring(c + 5));
                return Wicket.Browser.isIE() && b < 9
            }, isIELessThan11: function () {
                return !Wicket.Browser.isSafari() && typeof (document.all) !== "undefined" && typeof (window.opera) === "undefined"
            }, isIE11: function () {
                var c = window.navigator.userAgent;
                var b = c.indexOf("Trident");
                var d = c.indexOf("rv:11");
                return b && d
            }, isGecko: function () {
                return (/Gecko/).test(window.navigator.userAgent) && !Wicket.Browser.isSafari()
            }
        }, Event: {
            idCounter: 0,
            getId: function (c) {
                var b = jQuery(c), d = b.prop("id");
                if (typeof (d) === "string" && d.length > 0) {
                    return d
                } else {
                    d = "wicket-generated-id-" + Wicket.Event.idCounter++;
                    b.prop("id", d);
                    return d
                }
            },
            keyCode: function (b) {
                return Wicket.Event.fix(b).keyCode
            },
            stop: function (b, c) {
                b = Wicket.Event.fix(b);
                if (c) {
                    b.stopImmediatePropagation()
                } else {
                    b.stopPropagation()
                }
                return b
            },
            fix: function (b) {
                var c = b || window.event;
                return jQuery.event.fix(c)
            },
            fire: function (b, c) {
                c = (c === "mousewheel" && Wicket.Browser.isGecko()) ? "DOMMouseScroll" : c;
                jQuery(b).trigger(c)
            },
            add: function (c, e, d, f, b) {
                if (e === "domready") {
                    jQuery(d)
                } else {
                    jQuery(function () {
                        e = (e === "mousewheel" && Wicket.Browser.isGecko()) ? "DOMMouseScroll" : e;
                        var g = c;
                        if (typeof (c) === "string") {
                            g = document.getElementById(c)
                        }
                        if (!g && Wicket.Log) {
                            Wicket.Log.error('Cannot bind a listener for event "' + e + '" on element "' + c + '" because the element is not in the DOM')
                        }
                        jQuery(g).on(e, b, f, d)
                    })
                }
                return c
            },
            remove: function (b, d, c) {
                jQuery(b).off(d, c)
            },
            subscribe: function (b, c) {
                if (b) {
                    jQuery(document).on(b, c)
                }
            },
            unsubscribe: function (b, c) {
                if (b) {
                    if (c) {
                        jQuery(document).off(b, c)
                    } else {
                        jQuery(document).off(b)
                    }
                } else {
                    jQuery(document).off()
                }
            },
            publish: function (c) {
                if (c) {
                    var b = Array.prototype.slice.call(arguments).slice(1);
                    jQuery(document).triggerHandler(c, b);
                    jQuery(document).triggerHandler("*", b)
                }
            },
            Topic: {
                DOM_NODE_REMOVING: "/dom/node/removing",
                DOM_NODE_ADDED: "/dom/node/added",
                AJAX_CALL_BEFORE: "/ajax/call/before",
                AJAX_CALL_PRECONDITION: "/ajax/call/precondition",
                AJAX_CALL_BEFORE_SEND: "/ajax/call/beforeSend",
                AJAX_CALL_SUCCESS: "/ajax/call/success",
                AJAX_CALL_COMPLETE: "/ajax/call/complete",
                AJAX_CALL_AFTER: "/ajax/call/after",
                AJAX_CALL_FAILURE: "/ajax/call/failure"
            }
        }
    })
})();
(function (undefined) {
    if (typeof (Wicket) === "object" && typeof (Wicket.Head) === "object") {
        return
    }
    if (typeof (DOMParser) === "undefined" && Wicket.Browser.isSafari()) {
        DOMParser = function () {
        };
        DOMParser.prototype.parseFromString = function () {
            window.alert("You are using an old version of Safari.\nTo be able to use this page you need at least version 2.0.1.")
        }
    }
    var createIFrame, getAjaxBaseUrl, isUndef, replaceAll, htmlToDomDocument;
    isUndef = function (target) {
        return (typeof (target) === "undefined" || target === null)
    };
    replaceAll = function (str, from, to) {
        var regex = new RegExp(from.replace(/\W/g, "\\$&"), "g");
        return str.replace(regex, to)
    };
    createIFrame = function (iframeName) {
        var $iframe = jQuery('<iframe name="' + iframeName + '" id="' + iframeName + '" src="about:blank" style="position: absolute; top: -9999px; left: -9999px;">');
        return $iframe[0]
    };
    getAjaxBaseUrl = function () {
        var baseUrl = Wicket.Ajax.baseUrl || ".";
        return baseUrl
    };
    htmlToDomDocument = function (htmlDocument) {
        var xmlAsString = htmlDocument.body.outerText;
        xmlAsString = xmlAsString.replace(/^\s+|\s+$/g, "");
        xmlAsString = xmlAsString.replace(/(\n|\r)-*/g, "");
        var xmldoc = Wicket.Xml.parse(xmlAsString);
        return xmldoc
    };
    var FunctionsExecuter = function (functions) {
        this.functions = functions;
        this.current = 0;
        this.depth = 0;
        this.processNext = function () {
            if (this.current < this.functions.length) {
                var f, run;
                f = this.functions[this.current];
                run = function () {
                    try {
                        var n = jQuery.proxy(this.notify, this);
                        return f(n)
                    } catch (e) {
                        Wicket.Log.error("FunctionsExecuter.processNext: " + e);
                        return FunctionsExecuter.FAIL
                    }
                };
                run = jQuery.proxy(run, this);
                this.current++;
                if (this.depth > FunctionsExecuter.DEPTH_LIMIT) {
                    this.depth = 0;
                    window.setTimeout(run, 1)
                } else {
                    var retValue = run();
                    if (isUndef(retValue) || retValue === FunctionsExecuter.ASYNC) {
                        this.depth++
                    }
                    return retValue
                }
            }
        };
        this.start = function () {
            var retValue = FunctionsExecuter.DONE;
            while (retValue === FunctionsExecuter.DONE) {
                retValue = this.processNext()
            }
        };
        this.notify = function () {
            this.start()
        }
    };
    FunctionsExecuter.DONE = 1;
    FunctionsExecuter.FAIL = 2;
    FunctionsExecuter.ASYNC = 3;
    FunctionsExecuter.DEPTH_LIMIT = 1000;
    Wicket.Class = {
        create: function () {
            return function () {
                this.initialize.apply(this, arguments)
            }
        }
    };
    Wicket.Log = {
        enabled: function () {
            return Wicket.Ajax.DebugWindow && Wicket.Ajax.DebugWindow.enabled
        }, info: function (msg) {
            if (Wicket.Log.enabled()) {
                Wicket.Ajax.DebugWindow.logInfo(msg)
            }
        }, error: function (msg) {
            if (Wicket.Log.enabled()) {
                Wicket.Ajax.DebugWindow.logError(msg)
            }
        }, log: function (msg) {
            if (Wicket.Log.enabled()) {
                Wicket.Ajax.DebugWindow.log(msg)
            }
        }
    };
    Wicket.Channel = Wicket.Class.create();
    Wicket.Channel.prototype = {
        initialize: function (name) {
            name = name || "0|s";
            var res = name.match(/^([^|]+)\|(d|s|a)$/);
            if (isUndef(res)) {
                this.name = "0";
                this.type = "s"
            } else {
                this.name = res[1];
                this.type = res[2]
            }
            this.callbacks = [];
            this.busy = false
        }, schedule: function (callback) {
            if (this.busy === false) {
                this.busy = true;
                try {
                    return callback()
                } catch (exception) {
                    this.busy = false;
                    Wicket.Log.error("An error occurred while executing Ajax request:" + exception)
                }
            } else {
                var busyChannel = "Channel '" + this.name + "' is busy";
                if (this.type === "s") {
                    Wicket.Log.info(busyChannel + " - scheduling the callback to be executed when the previous request finish.");
                    this.callbacks.push(callback)
                } else {
                    if (this.type === "d") {
                        Wicket.Log.info(busyChannel + " - dropping all previous scheduled callbacks and scheduled a new one to be executed when the current request finish.");
                        this.callbacks = [];
                        this.callbacks[0] = callback
                    } else {
                        if (this.type === "a") {
                            Wicket.Log.info(busyChannel + " - ignoring the Ajax call because there is a running request.")
                        }
                    }
                }
                return null
            }
        }, done: function () {
            var c = null;
            if (this.callbacks.length > 0) {
                c = this.callbacks.shift()
            }
            if (c !== null && typeof (c) !== "undefined") {
                Wicket.Log.info("Calling postponed function...");
                window.setTimeout(c, 1)
            } else {
                this.busy = false
            }
        }
    };
    Wicket.ChannelManager = Wicket.Class.create();
    Wicket.ChannelManager.prototype = {
        initialize: function () {
            this.channels = {}
        }, schedule: function (channel, callback) {
            var parsed = new Wicket.Channel(channel);
            var c = this.channels[parsed.name];
            if (isUndef(c)) {
                c = parsed;
                this.channels[c.name] = c
            } else {
                c.type = parsed.type
            }
            return c.schedule(callback)
        }, done: function (channel) {
            var parsed = new Wicket.Channel(channel);
            var c = this.channels[parsed.name];
            if (!isUndef(c)) {
                c.done();
                if (!c.busy) {
                    delete this.channels[parsed.name]
                }
            }
        }
    };
    Wicket.Ajax = {};
    Wicket.Ajax.Call = Wicket.Class.create();
    Wicket.Ajax.Call.prototype = {
        initialize: jQuery.noop, _initializeDefaults: function (attrs) {
            if (typeof (attrs.ch) !== "string") {
                attrs.ch = "0|s"
            }
            if (typeof (attrs.wr) !== "boolean") {
                attrs.wr = true
            }
            if (typeof (attrs.dt) !== "string") {
                attrs.dt = "xml"
            }
            if (typeof (attrs.m) !== "string") {
                attrs.m = "GET"
            }
            if (attrs.async !== false) {
                attrs.async = true
            }
            if (!jQuery.isNumeric(attrs.rt)) {
                attrs.rt = 0
            }
            if (attrs.ad !== true) {
                attrs.ad = false
            }
            if (!attrs.sp) {
                attrs.sp = "stop"
            }
        }, _getTarget: function (attrs) {
            var target;
            if (attrs.event) {
                target = attrs.event.target
            } else {
                if (!jQuery.isWindow(attrs.c)) {
                    target = Wicket.$(attrs.c)
                } else {
                    target = window
                }
            }
            return target
        }, _executeHandlers: function (handlers) {
            if (jQuery.isArray(handlers)) {
                var args = Array.prototype.slice.call(arguments).slice(1);
                var attrs = args[0];
                var that = this._getTarget(attrs);
                for (var i = 0; i < handlers.length; i++) {
                    var handler = handlers[i];
                    if (jQuery.isFunction(handler)) {
                        handler.apply(that, args)
                    } else {
                        new Function(handler).apply(that, args)
                    }
                }
            }
        }, _asParamArray: function (parameters) {
            var result = [], value, name;
            if (jQuery.isArray(parameters)) {
                result = parameters
            } else {
                if (jQuery.isPlainObject(parameters)) {
                    for (name in parameters) {
                        value = parameters[name];
                        result.push({name: name, value: value})
                    }
                }
            }
            return result
        }, _calculateDynamicParameters: function (attrs) {
            var deps = attrs.dep, params = [];
            for (var i = 0; i < deps.length; i++) {
                var dep = deps[i], extraParam;
                if (jQuery.isFunction(dep)) {
                    extraParam = dep(attrs)
                } else {
                    extraParam = new Function("attrs", dep)(attrs)
                }
                extraParam = this._asParamArray(extraParam);
                params = params.concat(extraParam)
            }
            return jQuery.param(params)
        }, ajax: function (attrs) {
            this._initializeDefaults(attrs);
            var res = Wicket.channelManager.schedule(attrs.ch, Wicket.bind(function () {
                this.doAjax(attrs)
            }, this));
            return res !== null ? res : true
        }, doAjax: function (attrs) {
            this.channel = attrs.ch;
            var headers = {"Wicket-Ajax": "true", "Wicket-Ajax-BaseURL": getAjaxBaseUrl()},
                data = this._asParamArray(attrs.ep), self = this, defaultPrecondition = [function (attributes) {
                    if (attributes.c) {
                        if (attributes.f) {
                            return Wicket.$$(attributes.c) && Wicket.$$(attributes.f)
                        } else {
                            return Wicket.$$(attributes.c)
                        }
                    }
                    return true
                }], context = {attrs: attrs, steps: []}, we = Wicket.Event, topic = we.Topic;
            if (Wicket.Focus.lastFocusId) {
                headers["Wicket-FocusedElementId"] = Wicket.Focus.lastFocusId
            }
            self._executeHandlers(attrs.bh, attrs);
            we.publish(topic.AJAX_CALL_BEFORE, attrs);
            var preconditions = attrs.pre || [];
            preconditions = defaultPrecondition.concat(preconditions);
            if (jQuery.isArray(preconditions)) {
                var that = this._getTarget(attrs);
                for (var p = 0; p < preconditions.length; p++) {
                    var precondition = preconditions[p];
                    var result;
                    if (jQuery.isFunction(precondition)) {
                        result = precondition.call(that, attrs)
                    } else {
                        result = new Function(precondition).call(that, attrs)
                    }
                    if (result === false) {
                        Wicket.Log.info("Ajax request stopped because of precondition check, url: " + attrs.u);
                        self.done();
                        return false
                    }
                }
            }
            we.publish(topic.AJAX_CALL_PRECONDITION, attrs);
            if (attrs.mp) {
                var ret = self.submitMultipartForm(context);
                return ret
            }
            if (attrs.f) {
                var form = Wicket.$(attrs.f);
                data = data.concat(Wicket.Form.serializeForm(form));
                if (attrs.sc) {
                    var scName = attrs.sc;
                    data = data.concat({name: scName, value: 1})
                }
            } else {
                if (attrs.c && !jQuery.isWindow(attrs.c)) {
                    var el = Wicket.$(attrs.c);
                    data = data.concat(Wicket.Form.serializeElement(el))
                }
            }
            data = jQuery.param(data);
            var jqXHR = jQuery.ajax({
                url: attrs.u,
                type: attrs.m,
                context: self,
                beforeSend: function (jqXHR, settings) {
                    if (jQuery.isArray(attrs.dep)) {
                        var queryString, separator;
                        queryString = this._calculateDynamicParameters(attrs);
                        if (settings.type.toLowerCase() === "post") {
                            separator = settings.data.length > 0 ? "&" : "";
                            settings.data = settings.data + separator + queryString;
                            jqXHR.setRequestHeader("Content-Type", settings.contentType)
                        } else {
                            separator = settings.url.indexOf("?") > -1 ? "&" : "?";
                            settings.url = settings.url + separator + queryString
                        }
                    }
                    self._executeHandlers(attrs.bsh, attrs, jqXHR, settings);
                    we.publish(topic.AJAX_CALL_BEFORE_SEND, attrs, jqXHR, settings);
                    if (attrs.i) {
                        Wicket.DOM.showIncrementally(attrs.i)
                    }
                },
                data: data,
                dataType: attrs.dt,
                async: attrs.async,
                timeout: attrs.rt,
                cache: false,
                headers: headers,
                success: function (data, textStatus, jqXHR) {
                    if (attrs.wr) {
                        self.processAjaxResponse(data, textStatus, jqXHR, context)
                    } else {
                        self._executeHandlers(attrs.sh, attrs, jqXHR, data, textStatus);
                        we.publish(topic.AJAX_CALL_SUCCESS, attrs, jqXHR, data, textStatus)
                    }
                },
                error: function (jqXHR, textStatus, errorMessage) {
                    self.failure(context, jqXHR, errorMessage, textStatus)
                },
                complete: function (jqXHR, textStatus) {
                    context.steps.push(jQuery.proxy(function (notify) {
                        if (attrs.i) {
                            Wicket.DOM.hideIncrementally(attrs.i)
                        }
                        self._executeHandlers(attrs.coh, attrs, jqXHR, textStatus);
                        we.publish(topic.AJAX_CALL_COMPLETE, attrs, jqXHR, textStatus);
                        self.done();
                        return FunctionsExecuter.DONE
                    }, self));
                    var executer = new FunctionsExecuter(context.steps);
                    executer.start()
                }
            });
            self._executeHandlers(attrs.ah, attrs);
            we.publish(topic.AJAX_CALL_AFTER, attrs);
            return jqXHR
        }, process: function (data) {
            var context = {attrs: {}, steps: []};
            var xmlDocument = Wicket.Xml.parse(data);
            this.loadedCallback(xmlDocument, context);
            var executer = new FunctionsExecuter(context.steps);
            executer.start()
        }, processAjaxResponse: function (data, textStatus, jqXHR, context) {
            if (jqXHR.readyState === 4) {
                var redirectUrl;
                try {
                    redirectUrl = jqXHR.getResponseHeader("Ajax-Location")
                } catch (ignore) {
                }
                if (typeof (redirectUrl) !== "undefined" && redirectUrl !== null && redirectUrl !== "") {
                    this.success(context);
                    this.done();
                    var rhttp = /^http:\/\//, rhttps = /^https:\/\//;
                    if (redirectUrl.charAt(0) === "/" || rhttp.test(redirectUrl) || rhttps.test(redirectUrl)) {
                        window.location = redirectUrl
                    } else {
                        var urlDepth = 0;
                        while (redirectUrl.substring(0, 3) === "../") {
                            urlDepth++;
                            redirectUrl = redirectUrl.substring(3)
                        }
                        var calculatedRedirect = window.location.pathname;
                        while (urlDepth > -1) {
                            urlDepth--;
                            var i = calculatedRedirect.lastIndexOf("/");
                            if (i > -1) {
                                calculatedRedirect = calculatedRedirect.substring(0, i)
                            }
                        }
                        calculatedRedirect += "/" + redirectUrl;
                        if (Wicket.Browser.isGecko()) {
                            calculatedRedirect = window.location.protocol + "//" + window.location.host + calculatedRedirect
                        }
                        window.location = calculatedRedirect
                    }
                } else {
                    if (Wicket.Log.enabled()) {
                        var responseAsText = jqXHR.responseText;
                        Wicket.Log.info("Received ajax response (" + responseAsText.length + " characters)");
                        Wicket.Log.info("\n" + responseAsText)
                    }
                    return this.loadedCallback(data, context)
                }
            }
        }, submitMultipartForm: function (context) {
            var attrs = context.attrs;
            var form = Wicket.$(attrs.f);
            if (!form) {
                Wicket.Log.error("Wicket.Ajax.Call.submitForm: Trying to submit form with id '" + attrs.f + "' that is not in document.");
                return
            }
            if (form.tagName.toLowerCase() !== "form") {
                do {
                    form = form.parentNode
                } while (form.tagName.toLowerCase() !== "form" && form !== document.body)
            }
            if (form.tagName.toLowerCase() !== "form") {
                Wicket.Log.error("Cannot submit form with id " + attrs.f + " because there is no form element in the hierarchy.");
                return false
            }
            var submittingAttribute = "data-wicket-submitting";
            if (form.onsubmit && !form.getAttribute(submittingAttribute)) {
                form.setAttribute(submittingAttribute, submittingAttribute);
                var retValue = true;
                try {
                    retValue = form.onsubmit()
                } finally {
                    form.removeAttribute(submittingAttribute)
                }
                if (!retValue) {
                    return
                }
            }
            var originalFormAction = form.action;
            var originalFormTarget = form.target;
            var originalFormMethod = form.method;
            var originalFormEnctype = form.enctype;
            var originalFormEncoding = form.encoding;
            var iframeName = "wicket-submit-" + ("" + Math.random()).substr(2);
            var iframe = createIFrame(iframeName);
            document.body.appendChild(iframe);
            form.target = iframe.name;
            var separator = (attrs.u.indexOf("?") > -1 ? "&" : "?");
            form.action = attrs.u + separator + "wicket-ajax=true&wicket-ajax-baseurl=" + Wicket.Form.encode(getAjaxBaseUrl());
            if (attrs.ep) {
                var extraParametersArray = this._asParamArray(attrs.ep);
                if (extraParametersArray.length > 0) {
                    var extraParametersQueryString = jQuery.param(extraParametersArray);
                    form.action = form.action + "&" + extraParametersQueryString
                }
            }
            if (jQuery.isArray(attrs.dep)) {
                var dynamicExtraParameters = this._calculateDynamicParameters(attrs);
                if (dynamicExtraParameters) {
                    form.action = form.action + "&" + dynamicExtraParameters
                }
            }
            form.method = /PhantomJS/.test(navigator.userAgent) ? "get" : "post";
            form.enctype = "multipart/form-data";
            form.encoding = "multipart/form-data";
            if (attrs.sc) {
                var $btn = jQuery("<input type='hidden' name='" + attrs.sc + "' id='" + iframe.id + "-btn' value='1'/>");
                form.appendChild($btn[0])
            }
            var we = Wicket.Event;
            var topic = we.Topic;
            this._executeHandlers(attrs.bsh, attrs, null, null);
            we.publish(topic.AJAX_CALL_BEFORE_SEND, attrs, null, null);
            if (attrs.i) {
                Wicket.DOM.showIncrementally(attrs.i)
            }
            form.submit();
            this._executeHandlers(attrs.ah, attrs);
            we.publish(topic.AJAX_CALL_AFTER, attrs);
            we.add(iframe, "load.handleMultipartComplete", jQuery.proxy(this.handleMultipartComplete, this), context);
            form.action = originalFormAction;
            form.target = originalFormTarget;
            form.method = originalFormMethod;
            form.enctype = originalFormEnctype;
            form.encoding = originalFormEncoding;
            return true
        }, handleMultipartComplete: function (event) {
            var context = event.data, iframe = event.target, envelope;
            event.stopPropagation();
            jQuery(iframe).off("load.handleMultipartComplete");
            try {
                envelope = iframe.contentWindow.document
            } catch (e) {
                Wicket.Log.error("Cannot read Ajax response for multipart form submit: " + e)
            }
            if (isUndef(envelope)) {
                this.failure(context, null, "No XML response in the IFrame document", "Failure")
            } else {
                if (envelope.XMLDocument) {
                    envelope = envelope.XMLDocument
                }
                this.loadedCallback(envelope, context)
            }
            context.steps.push(jQuery.proxy(function (notify) {
                setTimeout(function () {
                    jQuery("#" + iframe.id + "-btn").remove();
                    jQuery(iframe).remove()
                }, 0);
                var attrs = context.attrs;
                if (attrs.i) {
                    Wicket.DOM.hideIncrementally(attrs.i)
                }
                this._executeHandlers(attrs.coh, attrs, null, null);
                Wicket.Event.publish(Wicket.Event.Topic.AJAX_CALL_COMPLETE, attrs, null, null);
                this.done();
                return FunctionsExecuter.DONE
            }, this));
            var executer = new FunctionsExecuter(context.steps);
            executer.start()
        }, loadedCallback: function (envelope, context) {
            try {
                var root = envelope.getElementsByTagName("ajax-response")[0];
                if (isUndef(root) && envelope.compatMode === "BackCompat") {
                    envelope = htmlToDomDocument(envelope);
                    root = envelope.getElementsByTagName("ajax-response")[0]
                }
                if (isUndef(root) || root.tagName !== "ajax-response") {
                    this.failure(context, null, "Could not find root <ajax-response> element", null);
                    return
                }
                var steps = context.steps;
                for (var i = 0; i < root.childNodes.length; ++i) {
                    var childNode = root.childNodes[i];
                    if (childNode.tagName === "header-contribution") {
                        this.processHeaderContribution(context, childNode)
                    } else {
                        if (childNode.tagName === "priority-evaluate") {
                            this.processEvaluation(context, childNode)
                        }
                    }
                }
                var stepIndexOfLastReplacedComponent = -1;
                for (var c = 0; c < root.childNodes.length; ++c) {
                    var node = root.childNodes[c];
                    if (node.tagName === "component") {
                        if (stepIndexOfLastReplacedComponent === -1) {
                            this.processFocusedComponentMark(context)
                        }
                        stepIndexOfLastReplacedComponent = steps.length;
                        this.processComponent(context, node)
                    } else {
                        if (node.tagName === "evaluate") {
                            this.processEvaluation(context, node)
                        } else {
                            if (node.tagName === "redirect") {
                                this.processRedirect(context, node)
                            }
                        }
                    }
                }
                if (stepIndexOfLastReplacedComponent !== -1) {
                    this.processFocusedComponentReplaceCheck(steps, stepIndexOfLastReplacedComponent)
                }
                this.success(context)
            } catch (exception) {
                this.failure(context, null, exception, null)
            }
        }, success: function (context) {
            context.steps.push(jQuery.proxy(function (notify) {
                Wicket.Log.info("Response processed successfully.");
                var attrs = context.attrs;
                this._executeHandlers(attrs.sh, attrs, null, null, "success");
                Wicket.Event.publish(Wicket.Event.Topic.AJAX_CALL_SUCCESS, attrs, null, null, "success");
                Wicket.Focus.attachFocusEvent();
                window.setTimeout("Wicket.Focus.requestFocus();", 0);
                return FunctionsExecuter.DONE
            }, this))
        }, failure: function (context, jqXHR, errorMessage, textStatus) {
            context.steps.push(jQuery.proxy(function (notify) {
                if (errorMessage) {
                    Wicket.Log.error("Wicket.Ajax.Call.failure: Error while parsing response: " + errorMessage)
                }
                var attrs = context.attrs;
                this._executeHandlers(attrs.fh, attrs, errorMessage);
                Wicket.Event.publish(Wicket.Event.Topic.AJAX_CALL_FAILURE, attrs, jqXHR, errorMessage, textStatus);
                return FunctionsExecuter.DONE
            }, this))
        }, done: function () {
            Wicket.channelManager.done(this.channel)
        }, processComponent: function (context, node) {
            context.steps.push(function (notify) {
                var compId = node.getAttribute("id");
                var text = Wicket.DOM.text(node);
                var encoding = node.getAttribute("encoding");
                if (encoding) {
                    text = Wicket.Head.Contributor.decode(encoding, text)
                }
                var element = Wicket.$(compId);
                if (isUndef(element)) {
                    Wicket.Log.error("Wicket.Ajax.Call.processComponent: Component with id [[" + compId + "]] was not found while trying to perform markup update. Make sure you called component.setOutputMarkupId(true) on the component whose markup you are trying to update.")
                } else {
                    Wicket.DOM.replace(element, text)
                }
                return FunctionsExecuter.DONE
            })
        }, processEvaluation: function (context, node) {
            var scriptWithIdentifierR = new RegExp("^\\(function\\(\\)\\{([a-zA-Z_]\\w*)\\|((.|\\n)*)?\\}\\)\\(\\);$");
            var scriptSplitterR = new RegExp("\\(function\\(\\)\\{[\\s\\S]*?}\\)\\(\\);", "gi");
            var text = Wicket.DOM.text(node);
            var encoding = node.getAttribute("encoding");
            if (encoding) {
                text = Wicket.Head.Contributor.decode(encoding, text)
            }
            var steps = context.steps;
            var log = Wicket.Log;
            var evaluateWithManualNotify = function (parameters, body) {
                return function (notify) {
                    var f = jQuery.noop;
                    var toExecute = "f = function(" + parameters + ") {" + body + "};";
                    try {
                        eval(toExecute);
                        f(notify)
                    } catch (exception) {
                        log.error("Wicket.Ajax.Call.processEvaluation: Exception evaluating javascript: " + exception + ", text: " + text)
                    }
                    return FunctionsExecuter.ASYNC
                }
            };
            var evaluate = function (script) {
                return function (notify) {
                    try {
                        eval(script)
                    } catch (exception) {
                        log.error("Wicket.Ajax.Call.processEvaluation: Exception evaluating javascript: " + exception + ", text: " + text)
                    }
                    return FunctionsExecuter.DONE
                }
            };
            if (scriptWithIdentifierR.test(text)) {
                var scripts = [];
                var scr;
                while ((scr = scriptSplitterR.exec(text)) != null) {
                    scripts.push(scr[0])
                }
                for (var s = 0; s < scripts.length; s++) {
                    var script = scripts[s];
                    if (script) {
                        var scriptWithIdentifier = script.match(scriptWithIdentifierR);
                        if (scriptWithIdentifier) {
                            steps.push(evaluateWithManualNotify(scriptWithIdentifier[1], scriptWithIdentifier[2]))
                        } else {
                            steps.push(evaluate(script))
                        }
                    }
                }
            } else {
                steps.push(evaluate(text))
            }
        }, processHeaderContribution: function (context, node) {
            var c = Wicket.Head.Contributor;
            c.processContribution(context, node)
        }, processRedirect: function (context, node) {
            var text = Wicket.DOM.text(node);
            Wicket.Log.info("Redirecting to: " + text);
            window.location = text
        }, processFocusedComponentMark: function (context) {
            context.steps.push(function (notify) {
                Wicket.Focus.markFocusedComponent();
                return FunctionsExecuter.DONE
            })
        }, processFocusedComponentReplaceCheck: function (steps, lastReplaceComponentStep) {
            steps.splice(lastReplaceComponentStep + 1, 0, function (notify) {
                Wicket.Focus.checkFocusedComponentReplaced();
                return FunctionsExecuter.DONE
            })
        }
    };
    Wicket.ThrottlerEntry = Wicket.Class.create();
    Wicket.ThrottlerEntry.prototype = {
        initialize: function (func) {
            this.func = func;
            this.timestamp = new Date().getTime();
            this.timeoutVar = undefined
        }, getTimestamp: function () {
            return this.timestamp
        }, getFunc: function () {
            return this.func
        }, setFunc: function (func) {
            this.func = func
        }, getTimeoutVar: function () {
            return this.timeoutVar
        }, setTimeoutVar: function (timeoutVar) {
            this.timeoutVar = timeoutVar
        }
    };
    Wicket.Throttler = Wicket.Class.create();
    Wicket.Throttler.entries = [];
    Wicket.Throttler.prototype = {
        initialize: function (postponeTimerOnUpdate) {
            this.postponeTimerOnUpdate = postponeTimerOnUpdate
        }, throttle: function (id, millis, func) {
            var entries = Wicket.Throttler.entries;
            var entry = entries[id];
            var me = this;
            if (typeof (entry) === "undefined") {
                entry = new Wicket.ThrottlerEntry(func);
                entry.setTimeoutVar(window.setTimeout(function () {
                    me.execute(id)
                }, millis));
                entries[id] = entry
            } else {
                entry.setFunc(func);
                if (this.postponeTimerOnUpdate) {
                    window.clearTimeout(entry.getTimeoutVar());
                    entry.setTimeoutVar(window.setTimeout(function () {
                        me.execute(id)
                    }, millis))
                }
            }
        }, execute: function (id) {
            var entries = Wicket.Throttler.entries;
            var entry = entries[id];
            if (typeof (entry) !== "undefined") {
                var func = entry.getFunc();
                entries[id] = undefined;
                return func()
            }
        }
    };
    jQuery.extend(true, Wicket, {
        channelManager: new Wicket.ChannelManager(), throttler: new Wicket.Throttler(), $: function (arg) {
            return Wicket.DOM.get(arg)
        }, $$: function (element) {
            return Wicket.DOM.inDoc(element)
        }, merge: function (object1, object2) {
            return jQuery.extend({}, object1, object2)
        }, bind: function (fn, context) {
            return jQuery.proxy(fn, context)
        }, Xml: {
            parse: function (text) {
                var xmlDocument;
                if (window.DOMParser) {
                    var parser = new DOMParser();
                    xmlDocument = parser.parseFromString(text, "text/xml")
                } else {
                    if (window.ActiveXObject) {
                        try {
                            xmlDocument = new ActiveXObject("Msxml2.DOMDocument.6.0")
                        } catch (err6) {
                            try {
                                xmlDocument = new ActiveXObject("Msxml2.DOMDocument.5.0")
                            } catch (err5) {
                                try {
                                    xmlDocument = new ActiveXObject("Msxml2.DOMDocument.4.0")
                                } catch (err4) {
                                    try {
                                        xmlDocument = new ActiveXObject("MSXML2.DOMDocument.3.0")
                                    } catch (err3) {
                                        try {
                                            xmlDocument = new ActiveXObject("Microsoft.XMLDOM")
                                        } catch (err2) {
                                            Wicket.Log.error("Cannot create DOM document: " + err2)
                                        }
                                    }
                                }
                            }
                        }
                        if (xmlDocument) {
                            xmlDocument.async = "false";
                            if (!xmlDocument.loadXML(text)) {
                                Wicket.Log.error("Error parsing response: " + text)
                            }
                        }
                    }
                }
                return xmlDocument
            }
        }, Form: {
            encode: function (text) {
                if (window.encodeURIComponent) {
                    return window.encodeURIComponent(text)
                } else {
                    return window.escape(text)
                }
            }, serializeSelect: function (select) {
                var result = [];
                if (select) {
                    var $select = jQuery(select);
                    if ($select.length > 0 && $select.prop("disabled") === false) {
                        var name = $select.prop("name");
                        var values = $select.val();
                        if (jQuery.isArray(values)) {
                            for (var v = 0; v < values.length; v++) {
                                var value = values[v];
                                result.push({name: name, value: value})
                            }
                        } else {
                            result.push({name: name, value: values})
                        }
                    }
                }
                return result
            }, serializeInput: function (input) {
                var result = [];
                if (input && input.type && !(input.type === "image" || input.type === "submit")) {
                    var $input = jQuery(input);
                    result = $input.serializeArray()
                }
                return result
            }, excludeFromAjaxSerialization: {}, serializeElement: function (element) {
                if (!element) {
                    return []
                } else {
                    if (typeof (element) === "string") {
                        element = Wicket.$(element)
                    }
                }
                if (Wicket.Form.excludeFromAjaxSerialization && element.id && Wicket.Form.excludeFromAjaxSerialization[element.id] === "true") {
                    return []
                }
                var tag = element.tagName.toLowerCase();
                if (tag === "select") {
                    return Wicket.Form.serializeSelect(element)
                } else {
                    if (tag === "input" || tag === "textarea") {
                        return Wicket.Form.serializeInput(element)
                    } else {
                        return []
                    }
                }
            }, serializeForm: function (form) {
                var result = [], elements, nodeListToArray, nodeId;
                nodeListToArray = function (nodeList) {
                    var arr = [];
                    if (nodeList && nodeList.length) {
                        for (nodeId = 0; nodeId < nodeList.length; nodeId++) {
                            arr.push(nodeList.item(nodeId))
                        }
                    }
                    return arr
                };
                if (form) {
                    if (form.tagName.toLowerCase() === "form") {
                        elements = form.elements
                    } else {
                        do {
                            form = form.parentNode
                        } while (form.tagName.toLowerCase() !== "form" && form.tagName.toLowerCase() !== "body");
                        elements = nodeListToArray(form.getElementsByTagName("input"));
                        elements = elements.concat(nodeListToArray(form.getElementsByTagName("select")));
                        elements = elements.concat(nodeListToArray(form.getElementsByTagName("textarea")))
                    }
                }
                for (var i = 0; i < elements.length; ++i) {
                    var el = elements[i];
                    if (el.name && el.name !== "") {
                        result = result.concat(Wicket.Form.serializeElement(el))
                    }
                }
                return result
            }, serialize: function (element, dontTryToFindRootForm) {
                if (typeof (element) === "string") {
                    element = Wicket.$(element)
                }
                if (element.tagName.toLowerCase() === "form") {
                    return Wicket.Form.serializeForm(element)
                } else {
                    var elementBck = element;
                    if (dontTryToFindRootForm !== true) {
                        do {
                            element = element.parentNode
                        } while (element.tagName.toLowerCase() !== "form" && element.tagName.toLowerCase() !== "body")
                    }
                    if (element.tagName.toLowerCase() === "form") {
                        return Wicket.Form.serializeForm(element)
                    } else {
                        var form = document.createElement("form");
                        var parent = elementBck.parentNode;
                        parent.replaceChild(form, elementBck);
                        form.appendChild(elementBck);
                        var result = Wicket.Form.serializeForm(form);
                        parent.replaceChild(elementBck, form);
                        return result
                    }
                }
            }
        }, DOM: {
            show: function (e, display) {
                e = Wicket.$(e);
                if (e !== null) {
                    if (isUndef(display)) {
                        jQuery(e).show()
                    } else {
                        e.style.display = display
                    }
                }
            }, hide: function (e) {
                e = Wicket.$(e);
                if (e !== null) {
                    jQuery(e).hide()
                }
            }, toggleClass: function (elementId, cssClass, Switch) {
                jQuery("#" + elementId).toggleClass(cssClass, Switch)
            }, showIncrementally: function (e) {
                e = Wicket.$(e);
                if (e === null) {
                    return
                }
                var count = e.getAttribute("showIncrementallyCount");
                count = parseInt(isUndef(count) ? 0 : count, 10);
                if (count >= 0) {
                    Wicket.DOM.show(e)
                }
                e.setAttribute("showIncrementallyCount", count + 1)
            }, hideIncrementally: function (e) {
                e = Wicket.$(e);
                if (e === null) {
                    return
                }
                var count = e.getAttribute("showIncrementallyCount");
                count = parseInt(isUndef(count) ? 0 : count - 1, 10);
                if (count <= 0) {
                    Wicket.DOM.hide(e)
                }
                e.setAttribute("showIncrementallyCount", count)
            }, get: function (arg) {
                if (isUndef(arg)) {
                    return null
                }
                if (arguments.length > 1) {
                    var e = [];
                    for (var i = 0; i < arguments.length; i++) {
                        e.push(Wicket.DOM.get(arguments[i]))
                    }
                    return e
                } else {
                    if (typeof arg === "string") {
                        return document.getElementById(arg)
                    } else {
                        return arg
                    }
                }
            }, inDoc: function (element) {
                if (element === window) {
                    return true
                }
                if (typeof (element) === "string") {
                    element = Wicket.$(element)
                }
                if (isUndef(element) || isUndef(element.tagName)) {
                    return false
                }
                var id = element.getAttribute("id");
                if (isUndef(id) || id === "") {
                    return element.ownerDocument === document
                } else {
                    return document.getElementById(id) === element
                }
            }, replace: function (element, text) {
                var we = Wicket.Event;
                var topic = we.Topic;
                we.publish(topic.DOM_NODE_REMOVING, element);
                if (element.tagName.toLowerCase() === "title") {
                    var titleText = />(.*?)</.exec(text)[1];
                    document.title = titleText;
                    return
                } else {
                    var cleanedText = jQuery.trim(text);
                    var $newElement = jQuery(cleanedText);
                    jQuery(element).replaceWith($newElement)
                }
                var newElement = Wicket.$(element.id);
                if (newElement) {
                    we.publish(topic.DOM_NODE_ADDED, newElement)
                }
            }, serializeNodeChildren: function (node) {
                if (isUndef(node)) {
                    return ""
                }
                var result = [];
                if (node.childNodes.length > 0) {
                    for (var i = 0; i < node.childNodes.length; i++) {
                        var thisNode = node.childNodes[i];
                        switch (thisNode.nodeType) {
                            case 1:
                            case 5:
                                result.push(this.serializeNode(thisNode));
                                break;
                            case 8:
                                result.push("<!--");
                                result.push(thisNode.nodeValue);
                                result.push("-->");
                                break;
                            case 4:
                                result.push("<![CDATA[");
                                result.push(thisNode.nodeValue);
                                result.push("]]>");
                                break;
                            case 3:
                            case 2:
                                result.push(thisNode.nodeValue);
                                break;
                            default:
                                break
                        }
                    }
                } else {
                    result.push(node.textContent || node.text)
                }
                return result.join("")
            }, serializeNode: function (node) {
                if (isUndef(node)) {
                    return ""
                }
                var result = [];
                result.push("<");
                result.push(node.nodeName);
                if (node.attributes && node.attributes.length > 0) {
                    for (var i = 0; i < node.attributes.length; i++) {
                        if (node.attributes[i].nodeValue && node.attributes[i].specified) {
                            result.push(" ");
                            result.push(node.attributes[i].name);
                            result.push('="');
                            result.push(node.attributes[i].value);
                            result.push('"')
                        }
                    }
                }
                result.push(">");
                result.push(Wicket.DOM.serializeNodeChildren(node));
                result.push("</");
                result.push(node.nodeName);
                result.push(">");
                return result.join("")
            }, containsElement: function (element) {
                var id = element.getAttribute("id");
                if (id) {
                    return Wicket.$(id) !== null
                } else {
                    return false
                }
            }, text: function (node) {
                if (isUndef(node)) {
                    return ""
                }
                var result = [];
                if (node.childNodes.length > 0) {
                    for (var i = 0; i < node.childNodes.length; i++) {
                        var thisNode = node.childNodes[i];
                        switch (thisNode.nodeType) {
                            case 1:
                            case 5:
                                result.push(this.text(thisNode));
                                break;
                            case 3:
                            case 4:
                                result.push(thisNode.nodeValue);
                                break;
                            default:
                                break
                        }
                    }
                } else {
                    result.push(node.textContent || node.text)
                }
                return result.join("")
            }
        }, Ajax: {
            Call: Wicket.Ajax.Call, _handleEventCancelation: function (attrs) {
                var evt = attrs.event;
                if (evt) {
                    if (!attrs.ad) {
                        try {
                            evt.preventDefault()
                        } catch (ignore) {
                        }
                    }
                    if (attrs.sp === "stop") {
                        Wicket.Event.stop(evt)
                    } else {
                        if (attrs.sp === "stopImmediate") {
                            Wicket.Event.stop(evt, true)
                        }
                    }
                }
            }, get: function (attrs) {
                attrs.m = "GET";
                return Wicket.Ajax.ajax(attrs)
            }, post: function (attrs) {
                attrs.m = "POST";
                return Wicket.Ajax.ajax(attrs)
            }, ajax: function (attrs) {
                attrs.c = attrs.c || window;
                attrs.e = attrs.e || ["domready"];
                if (!jQuery.isArray(attrs.e)) {
                    attrs.e = [attrs.e]
                }
                jQuery.each(attrs.e, function (idx, evt) {
                    Wicket.Event.add(attrs.c, evt, function (jqEvent, data) {
                        var call = new Wicket.Ajax.Call();
                        var attributes = jQuery.extend({}, attrs);
                        attributes.event = Wicket.Event.fix(jqEvent);
                        if (data) {
                            attributes.event.extraData = data
                        }
                        var throttlingSettings = attributes.tr;
                        if (throttlingSettings) {
                            var postponeTimerOnUpdate = throttlingSettings.p || false;
                            var throttler = new Wicket.Throttler(postponeTimerOnUpdate);
                            throttler.throttle(throttlingSettings.id, throttlingSettings.d, Wicket.bind(function () {
                                call.ajax(attributes)
                            }, this))
                        } else {
                            call.ajax(attributes)
                        }
                        Wicket.Ajax._handleEventCancelation(attributes)
                    }, null, attrs.sel)
                })
            }, process: function (data) {
                var call = new Wicket.Ajax.Call();
                call.process(data)
            }
        }, Head: {
            Contributor: {
                decode: function (encoding, text) {
                    var decode1 = function (text) {
                        return replaceAll(text, "]^", "]")
                    };
                    if (encoding === "wicket1") {
                        text = decode1(text)
                    }
                    return text
                }, parse: function (headerNode) {
                    var text = Wicket.DOM.text(headerNode);
                    var encoding = headerNode.getAttribute("encoding");
                    if (encoding !== null && encoding !== "") {
                        text = this.decode(encoding, text)
                    }
                    if (Wicket.Browser.isKHTML()) {
                        text = text.replace(/<script/g, "<SCRIPT");
                        text = text.replace(/<\/script>/g, "</SCRIPT>")
                    }
                    var xmldoc = Wicket.Xml.parse(text);
                    return xmldoc
                }, _checkParserError: function (node) {
                    var result = false;
                    if (!isUndef(node.tagName) && node.tagName.toLowerCase() === "parsererror") {
                        Wicket.Log.error("Error in parsing: " + node.textContent);
                        result = true
                    }
                    return result
                }, processContribution: function (context, headerNode) {
                    var xmldoc = this.parse(headerNode);
                    var rootNode = xmldoc.documentElement;
                    if (this._checkParserError(rootNode)) {
                        return
                    }
                    for (var i = 0; i < rootNode.childNodes.length; i++) {
                        var node = rootNode.childNodes[i];
                        if (this._checkParserError(node)) {
                            return
                        }
                        if (!isUndef(node.tagName)) {
                            var name = node.tagName.toLowerCase();
                            if (name === "wicket:link") {
                                for (var j = 0; j < node.childNodes.length; ++j) {
                                    var childNode = node.childNodes[j];
                                    if (childNode.nodeType === 1) {
                                        node = childNode;
                                        name = node.tagName.toLowerCase();
                                        break
                                    }
                                }
                            }
                            if (name === "link") {
                                this.processLink(context, node)
                            } else {
                                if (name === "script") {
                                    this.processScript(context, node)
                                } else {
                                    if (name === "style") {
                                        this.processStyle(context, node)
                                    }
                                }
                            }
                        } else {
                            if (node.nodeType === 8) {
                                this.processComment(context, node)
                            }
                        }
                    }
                }, processLink: function (context, node) {
                    context.steps.push(function (notify) {
                        if (Wicket.Head.containsElement(node, "href")) {
                            return FunctionsExecuter.DONE
                        }
                        var css = Wicket.Head.createElement("link");
                        css.id = node.getAttribute("id");
                        css.rel = node.getAttribute("rel");
                        css.href = node.getAttribute("href");
                        css.type = node.getAttribute("type");
                        Wicket.Head.addElement(css);
                        var img = document.createElement("img");
                        var notifyCalled = false;
                        img.onerror = function () {
                            if (!notifyCalled) {
                                notifyCalled = true;
                                notify()
                            }
                        };
                        img.src = css.href;
                        if (img.complete) {
                            if (!notifyCalled) {
                                notifyCalled = true;
                                notify()
                            }
                        }
                        return FunctionsExecuter.ASYNC
                    })
                }, processStyle: function (context, node) {
                    context.steps.push(function (notify) {
                        if (Wicket.DOM.containsElement(node)) {
                            return FunctionsExecuter.DONE
                        }
                        var content = Wicket.DOM.serializeNodeChildren(node);
                        if (Wicket.Browser.isIELessThan11()) {
                            try {
                                document.createStyleSheet().cssText = content;
                                return FunctionsExecuter.DONE
                            } catch (ignore) {
                                var run = function () {
                                    try {
                                        document.createStyleSheet().cssText = content
                                    } catch (e) {
                                        Wicket.Log.error("Wicket.Head.Contributor.processStyle: " + e)
                                    }
                                    notify()
                                };
                                window.setTimeout(run, 1);
                                return FunctionsExecuter.ASYNC
                            }
                        } else {
                            var style = Wicket.Head.createElement("style");
                            style.id = node.getAttribute("id");
                            var textNode = document.createTextNode(content);
                            style.appendChild(textNode);
                            Wicket.Head.addElement(style)
                        }
                        return FunctionsExecuter.DONE
                    })
                }, processScript: function (context, node) {
                    context.steps.push(function (notify) {
                        if (Wicket.DOM.containsElement(node) || Wicket.Head.containsElement(node, "src")) {
                            return FunctionsExecuter.DONE
                        }
                        var src = node.getAttribute("src");
                        if (src !== null && src !== "") {
                            var scriptDomNode = document.createElement("script");
                            var attrs = node.attributes;
                            for (var a = 0; a < attrs.length; a++) {
                                var attr = attrs[a];
                                scriptDomNode[attr.name] = attr.value
                            }
                            var onScriptReady = function () {
                                notify()
                            };
                            if (typeof (scriptDomNode.onload) !== "undefined") {
                                scriptDomNode.onload = onScriptReady
                            } else {
                                if (typeof (scriptDomNode.onreadystatechange) !== "undefined") {
                                    scriptDomNode.onreadystatechange = function () {
                                        if (scriptDomNode.readyState === "loaded" || scriptDomNode.readyState === "complete") {
                                            onScriptReady()
                                        }
                                    }
                                } else {
                                    if (Wicket.Browser.isGecko()) {
                                        scriptDomNode.onload = onScriptReady
                                    } else {
                                        window.setTimeout(onScriptReady, 10)
                                    }
                                }
                            }
                            Wicket.Head.addElement(scriptDomNode);
                            return FunctionsExecuter.ASYNC
                        } else {
                            var text = Wicket.DOM.serializeNodeChildren(node);
                            text = text.replace(/^\n\/\*<!\[CDATA\[\*\/\n/, "");
                            text = text.replace(/\n\/\*\]\]>\*\/\n$/, "");
                            var id = node.getAttribute("id");
                            var type = node.getAttribute("type");
                            if (typeof (id) === "string" && id.length > 0) {
                                Wicket.Head.addJavascript(text, id, "", type)
                            } else {
                                try {
                                    eval(text)
                                } catch (e) {
                                    Wicket.Log.error("Wicket.Head.Contributor.processScript: " + e + ": eval -> " + text)
                                }
                            }
                            return FunctionsExecuter.DONE
                        }
                    })
                }, processComment: function (context, node) {
                    context.steps.push(function (notify) {
                        var comment = document.createComment(node.nodeValue);
                        Wicket.Head.addElement(comment);
                        return FunctionsExecuter.DONE
                    })
                }
            }, createElement: function (name) {
                if (isUndef(name) || name === "") {
                    Wicket.Log.error("Cannot create an element without a name");
                    return
                }
                return document.createElement(name)
            }, addElement: function (element) {
                var head = document.getElementsByTagName("head");
                if (head[0]) {
                    head[0].appendChild(element)
                }
            }, containsElement: function (element, mandatoryAttribute) {
                var attr = element.getAttribute(mandatoryAttribute);
                if (isUndef(attr) || attr === "") {
                    return false
                }
                var head = document.getElementsByTagName("head")[0];
                if (element.tagName === "script") {
                    head = document
                }
                var nodes = head.getElementsByTagName(element.tagName);
                for (var i = 0; i < nodes.length; ++i) {
                    var node = nodes[i];
                    if (node.tagName.toLowerCase() === element.tagName.toLowerCase()) {
                        var loadedUrl = node.getAttribute(mandatoryAttribute);
                        var loadedUrl_ = node.getAttribute(mandatoryAttribute + "_");
                        if (loadedUrl === attr || loadedUrl_ === attr) {
                            return true
                        }
                    }
                }
                return false
            }, addJavascript: function (content, id, fakeSrc, type) {
                var script = Wicket.Head.createElement("script");
                if (id) {
                    script.id = id
                }
                if (!type || type.toLowerCase() === "text/javascript") {
                    type = "text/javascript";
                    content = "try{" + content + "}catch(e){Wicket.Log.error(e);}"
                }
                script.setAttribute("src_", fakeSrc);
                script.setAttribute("type", type);
                if (null === script.canHaveChildren || script.canHaveChildren) {
                    var textNode = document.createTextNode(content);
                    script.appendChild(textNode)
                } else {
                    script.text = content
                }
                Wicket.Head.addElement(script)
            }, addJavascripts: function (element, contentFilter) {
                function add(element) {
                    var src = element.getAttribute("src");
                    var type = element.getAttribute("type");
                    if (src !== null && src.length > 0) {
                        var e = document.createElement("script");
                        if (type) {
                            e.setAttribute("type", type)
                        }
                        e.setAttribute("src", src);
                        Wicket.Head.addElement(e)
                    } else {
                        var content = Wicket.DOM.serializeNodeChildren(element);
                        if (isUndef(content) || content === "") {
                            content = element.text
                        }
                        if (typeof (contentFilter) === "function") {
                            content = contentFilter(content)
                        }
                        Wicket.Head.addJavascript(content, element.id, "", type)
                    }
                }

                if (typeof (element) !== "undefined" && typeof (element.tagName) !== "undefined" && element.tagName.toLowerCase() === "script") {
                    add(element)
                } else {
                    if (element.childNodes.length > 0) {
                        var scripts = element.getElementsByTagName("script");
                        for (var i = 0; i < scripts.length; ++i) {
                            add(scripts[i])
                        }
                    }
                }
            }
        }, Drag: {
            init: function (element, onDragBegin, onDragEnd, onDrag) {
                if (typeof (onDragBegin) === "undefined") {
                    onDragBegin = jQuery.noop
                }
                if (typeof (onDragEnd) === "undefined") {
                    onDragEnd = jQuery.noop
                }
                if (typeof (onDrag) === "undefined") {
                    onDrag = jQuery.noop
                }
                element.wicketOnDragBegin = onDragBegin;
                element.wicketOnDrag = onDrag;
                element.wicketOnDragEnd = onDragEnd;
                Wicket.Event.add(element, "mousedown", Wicket.Drag.mouseDownHandler)
            }, mouseDownHandler: function (e) {
                e = Wicket.Event.fix(e);
                var element = this;
                Wicket.Event.stop(e);
                if (e.preventDefault) {
                    e.preventDefault()
                }
                element.wicketOnDragBegin(element);
                element.lastMouseX = e.clientX;
                element.lastMouseY = e.clientY;
                element.old_onmousemove = document.onmousemove;
                element.old_onmouseup = document.onmouseup;
                element.old_onselectstart = document.onselectstart;
                element.old_onmouseout = document.onmouseout;
                document.onselectstart = function () {
                    return false
                };
                document.onmousemove = Wicket.Drag.mouseMove;
                document.onmouseup = Wicket.Drag.mouseUp;
                document.onmouseout = Wicket.Drag.mouseOut;
                Wicket.Drag.current = element;
                return false
            }, clean: function (element) {
                element.onmousedown = null
            }, mouseMove: function (e) {
                e = Wicket.Event.fix(e);
                var o = Wicket.Drag.current;
                if (e.clientX < 0 || e.clientY < 0) {
                    return
                }
                if (o !== null) {
                    var deltaX = e.clientX - o.lastMouseX;
                    var deltaY = e.clientY - o.lastMouseY;
                    var res = o.wicketOnDrag(o, deltaX, deltaY, e);
                    if (isUndef(res)) {
                        res = [0, 0]
                    }
                    o.lastMouseX = e.clientX + res[0];
                    o.lastMouseY = e.clientY + res[1]
                }
                return false
            }, mouseUp: function () {
                var o = Wicket.Drag.current;
                if (o) {
                    o.wicketOnDragEnd(o);
                    o.lastMouseX = null;
                    o.lastMouseY = null;
                    document.onmousemove = o.old_onmousemove;
                    document.onmouseup = o.old_onmouseup;
                    document.onselectstart = o.old_onselectstart;
                    document.onmouseout = o.old_onmouseout;
                    o.old_mousemove = null;
                    o.old_mouseup = null;
                    o.old_onselectstart = null;
                    o.old_onmouseout = null;
                    Wicket.Drag.current = null
                }
            }, mouseOut: function (e) {
                if (false && Wicket.Browser.isGecko()) {
                    e = Wicket.Event.fix(e);
                    if (e.target.tagName === "HTML") {
                        Wicket.Drag.mouseUp(e)
                    }
                }
            }
        }, Focus: {
            lastFocusId: "",
            refocusLastFocusedComponentAfterResponse: false,
            focusSetFromServer: false,
            setFocus: function (event) {
                event = Wicket.Event.fix(event);
                var target = event.target;
                if (target) {
                    Wicket.Focus.refocusLastFocusedComponentAfterResponse = false;
                    Wicket.Focus.lastFocusId = target.id;
                    Wicket.Log.info("focus set on " + Wicket.Focus.lastFocusId)
                }
            },
            blur: function (event) {
                event = Wicket.Event.fix(event);
                var target = event.target;
                if (target && Wicket.Focus.lastFocusId === target.id) {
                    if (Wicket.Focus.refocusLastFocusedComponentAfterResponse) {
                        Wicket.Log.info("focus removed from " + target.id + " but ignored because of component replacement")
                    } else {
                        Wicket.Focus.lastFocusId = null;
                        Wicket.Log.info("focus removed from " + target.id)
                    }
                }
            },
            getFocusedElement: function () {
                if (typeof (Wicket.Focus.lastFocusId) !== "undefined" && Wicket.Focus.lastFocusId !== "" && Wicket.Focus.lastFocusId !== null) {
                    Wicket.Log.info("returned focused element: " + Wicket.$(Wicket.Focus.lastFocusId));
                    return Wicket.$(Wicket.Focus.lastFocusId)
                }
            },
            setFocusOnId: function (id) {
                if (typeof (id) !== "undefined" && id !== "" && id !== null) {
                    Wicket.Focus.refocusLastFocusedComponentAfterResponse = true;
                    Wicket.Focus.focusSetFromServer = true;
                    Wicket.Focus.lastFocusId = id;
                    Wicket.Log.info("focus set on " + Wicket.Focus.lastFocusId + " from serverside")
                } else {
                    Wicket.Focus.refocusLastFocusedComponentAfterResponse = false;
                    Wicket.Log.info("refocus focused component after request stopped from serverside")
                }
            },
            markFocusedComponent: function () {
                var focusedElement = Wicket.Focus.getFocusedElement();
                if (typeof (focusedElement) !== "undefined" && focusedElement !== null) {
                    focusedElement.wasFocusedBeforeComponentReplacements = true;
                    Wicket.Focus.refocusLastFocusedComponentAfterResponse = true;
                    Wicket.Focus.focusSetFromServer = false
                } else {
                    Wicket.Focus.refocusLastFocusedComponentAfterResponse = false
                }
            },
            checkFocusedComponentReplaced: function () {
                var focusedElement = Wicket.Focus.getFocusedElement();
                if (Wicket.Focus.refocusLastFocusedComponentAfterResponse === true) {
                    if (typeof (focusedElement) !== "undefined" && focusedElement !== null) {
                        if (typeof (focusedElement.wasFocusedBeforeComponentReplacements) !== "undefined") {
                            Wicket.Focus.refocusLastFocusedComponentAfterResponse = false
                        }
                    } else {
                        Wicket.Focus.refocusLastFocusedComponentAfterResponse = false;
                        Wicket.Focus.lastFocusId = ""
                    }
                }
            },
            requestFocus: function () {
                if (Wicket.Focus.refocusLastFocusedComponentAfterResponse && typeof (Wicket.Focus.lastFocusId) !== "undefined" && Wicket.Focus.lastFocusId !== "" && Wicket.Focus.lastFocusId !== null) {
                    var toFocus = Wicket.$(Wicket.Focus.lastFocusId);
                    if (toFocus !== null && typeof (toFocus) !== "undefined") {
                        Wicket.Log.info("Calling focus on " + Wicket.Focus.lastFocusId);
                        try {
                            if (Wicket.Focus.focusSetFromServer) {
                                toFocus.focus()
                            } else {
                                var temp = toFocus.onfocus;
                                toFocus.onfocus = null;
                                toFocus.focus();
                                window.setTimeout(function () {
                                    toFocus.onfocus = temp
                                }, 0)
                            }
                        } catch (ignore) {
                        }
                    } else {
                        Wicket.Focus.lastFocusId = "";
                        Wicket.Log.info("Couldn't set focus on " + Wicket.Focus.lastFocusId + " not on the page anymore")
                    }
                } else {
                    if (Wicket.Focus.refocusLastFocusedComponentAfterResponse) {
                        Wicket.Log.info("last focus id was not set")
                    } else {
                        Wicket.Log.info("refocus last focused component not needed/allowed")
                    }
                }
                Wicket.Focus.refocusLastFocusedComponentAfterResponse = false
            },
            setFocusOnElements: function (elements) {
                var len = elements.length;
                for (var i = 0; i < len; i++) {
                    if (elements[i].wicketFocusSet !== true) {
                        Wicket.Event.add(elements[i], "focus", Wicket.Focus.setFocus);
                        Wicket.Event.add(elements[i], "blur", Wicket.Focus.blur);
                        elements[i].wicketFocusSet = true
                    }
                }
            },
            attachFocusEvent: function () {
                Wicket.Focus.setFocusOnElements(document.getElementsByTagName("input"));
                Wicket.Focus.setFocusOnElements(document.getElementsByTagName("select"));
                Wicket.Focus.setFocusOnElements(document.getElementsByTagName("textarea"));
                Wicket.Focus.setFocusOnElements(document.getElementsByTagName("button"));
                Wicket.Focus.setFocusOnElements(document.getElementsByTagName("a"))
            }
        }
    });
    jQuery.event.special.inputchange = {
        keys: {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            END: 35,
            HOME: 36
        }, keyDownPressed: false, setup: function () {
            if (Wicket.Browser.isIELessThan11()) {
                jQuery(this).on("keydown", function (event) {
                    jQuery.event.special.inputchange.keyDownPressed = true
                });
                jQuery(this).on("cut paste", function (evt) {
                    var self = this;
                    if (false === jQuery.event.special.inputchange.keyDownPressed) {
                        window.setTimeout(function () {
                            jQuery.event.special.inputchange.handler.call(self, evt)
                        }, 10)
                    }
                });
                jQuery(this).on("keyup", function (evt) {
                    jQuery.event.special.inputchange.keyDownPressed = false;
                    jQuery.event.special.inputchange.handler.call(this, evt)
                })
            } else {
                jQuery(this).on("input", jQuery.event.special.inputchange.handler)
            }
        }, teardown: function () {
            jQuery(this).off("input keyup cut paste", jQuery.event.special.inputchange.handler)
        }, handler: function (evt) {
            var WE = Wicket.Event;
            var k = jQuery.event.special.inputchange.keys;
            var kc = WE.keyCode(WE.fix(evt));
            switch (kc) {
                case k.ENTER:
                case k.UP:
                case k.DOWN:
                case k.ESC:
                case k.TAB:
                case k.RIGHT:
                case k.LEFT:
                case k.SHIFT:
                case k.ALT:
                case k.CTRL:
                case k.HOME:
                case k.END:
                    return WE.stop(evt);
                default:
                    evt.type = "inputchange";
                    var args = Array.prototype.slice.call(arguments, 0);
                    return jQuery(this).trigger(evt.type, args)
            }
        }
    };
    Wicket.Event.add(window, "domready", Wicket.Focus.attachFocusEvent);
    Wicket.Event.subscribe("/dom/node/removing", function (jqEvent, element) {
        var id = element.id;
        if (Wicket.TimerHandles && Wicket.TimerHandles[id]) {
            window.clearTimeout(Wicket.TimerHandles[id]);
            delete Wicket.TimerHandles[id]
        }
    });
    Wicket.Event.subscribe("/dom/node/added", function () {
        if (Wicket.TimerHandles) {
            for (var timerHandle in Wicket.TimerHandles) {
                if (Wicket.$$(timerHandle) === false) {
                    window.clearTimeout(timerHandle);
                    delete Wicket.TimerHandles[timerHandle]
                }
            }
        }
    })
})();
(function (a) {
    if (typeof (Wicket.Choice) === "undefined") {
        Wicket.Choice = {};
        Wicket.Choice.acceptInput = function (d, c) {
            var b = c.event.target;
            return (b.name === d)
        };
        Wicket.Choice.getInputValues = function (e, d) {
            var b = [], c = d.event.target;
            var h = Wicket.$(d.c).getElementsByTagName("input");
            for (var f = 0; f < h.length; f++) {
                var g = h[f];
                if (g.name !== e) {
                    continue
                }
                if (!g.checked) {
                    continue
                }
                var j = g.value;
                b.push({name: e, value: j})
            }
            return b
        }
    }
})();
(function() {
    function init() {
        $('#fasettform').submit(function (e) {
            var th = $(this);
            e.preventDefault();
            console.log(th.serialize());
            $.ajax({
                type: th.attr('method'),
                url: th.attr('action'),
                data: th.serialize(),
                success: function (data) {

                    window.history.pushState(null, window.title, location.origin + location.pathname + '?' + th.serialize());
                    $('#sres').html(data);
                    init();
                },
                error: function (error) {
                    console.log(error);
                }
            })
        });
        $('input[name=s]').on('change', function() {
            $(this.form).submit();
        });
        $('.svart').on('change', function () {
            setC(1);
            $(this.form).submit();
        });
        $('input[name=f]').on('change', function () {
            setC(1);
            $('.wic').prop('checked', false);
            $(this.form).submit();
        });
        $('.wic').on('change', function () {
            setC(1);
            $(this.form).submit();
        });
        $('input.defaultFasett').on('change', function () {
            setC(1);
            $('.wic').prop('checked', false);
            $(this.form).submit();
        });

        var flere = $('#flere');
        if (flere) {
            flere.on('click', function() {
                var i = $('input[name=c]');
                var v = Number(i.val());
                i.val(v + 1);
                $('#fasettform').submit();
            });
        }


    }
    init();
    function setC(n) {
        $('input[name=c]').val(n);
    }
})();
