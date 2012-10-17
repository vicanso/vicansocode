# This is a basic VCL configuration file for varnish.  See the vcl(7)
# man page for details on VCL syntax and semantics.
# 
# Default backend definition.  Set this to point to your content
# server.
# 
backend vicanso{
    .host = "127.0.0.1";
    .port = "10000";
    .probe = {
        .url = "/";
        .interval = 5s;
        .timeout = 1s;
        .window = 5;
        .threshold = 3;
    }
}

sub vcl_recv {
    if (req.request != "GET" && req.request != "HEAD") {
        return (pass);
    }
    #ajax的请求不作缓存（可以考虑对部分的get请求作缓存）
    #userinfo.js主要是保存用户的信息，不作缓存
    if (req.url ~ "^/[a-zA-Z]+/ajax/" || req.url ~ "/nocacheinfo.js$"){
        return (pass);
    }    
    #将所有的cookie清除（用户的信息只要通过上面的userinfo.js请求，因此对于其它的请求，cookie是没意义的）
    unset req.http.cookie;
    #整理浏览器的accept-encoding
    if(req.http.Accept-Encoding){
        if(req.http.Accept-Encoding ~ "gzip"){
            set req.http.Accept-Encoding = "gzip";
        }elsif(req.http.Accept-Encoding ~ "deflate"){
            set req.http.Accept-Encoding = "deflate";
        }else{
            remove req.http.Accept-Encoding;
        }
    }

    if(!req.backend.healthy){
        set req.grace = 30m;
    }else{
        #在cache过期的后的30s内，使用旧的数据返回
        set req.grace = 30s;
    }
    return (lookup);
}

sub vcl_fetch {
    if(beresp.status == 500){
        #10s内同样的请求不会访问后端服务器（若有备用的，会请求备用，若无，则使用已过期的数据返回）
        set beresp.saintmode = 10s;
        restart;
    }
    #设置ttl
    set beresp.ttl = 5m;
    #保存cache的内容在ttl过期之后30m内不删除
    set beresp.grace = 30m;
}


#backend default {
#    .host = "127.0.0.1";
#    .port = "10000";
#}
# 
# Below is a commented-out copy of the default VCL logic.  If you
# redefine any of these subroutines, the built-in logic will be
# appended to your code.
# sub vcl_recv {
#     if (req.restarts == 0) {
# 	if (req.http.x-forwarded-for) {
# 	    set req.http.X-Forwarded-For =
# 		req.http.X-Forwarded-For + ", " + client.ip;
# 	} else {
# 	    set req.http.X-Forwarded-For = client.ip;
# 	}
#     }
#     if (req.request != "GET" &&
#       req.request != "HEAD" &&
#       req.request != "PUT" &&
#       req.request != "POST" &&
#       req.request != "TRACE" &&
#       req.request != "OPTIONS" &&
#       req.request != "DELETE") {
#         /* Non-RFC2616 or CONNECT which is weird. */
#         return (pipe);
#     }
#     if (req.request != "GET" && req.request != "HEAD") {
#         /* We only deal with GET and HEAD by default */
#         return (pass);
#     }
#     if (req.http.Authorization || req.http.Cookie) {
#         /* Not cacheable by default */
#         return (pass);
#     }
#     return (lookup);
# }
# 
# sub vcl_pipe {
#     # Note that only the first request to the backend will have
#     # X-Forwarded-For set.  If you use X-Forwarded-For and want to
#     # have it set for all requests, make sure to have:
#     # set bereq.http.connection = "close";
#     # here.  It is not set by default as it might break some broken web
#     # applications, like IIS with NTLM authentication.
#     return (pipe);
# }
# 
# sub vcl_pass {
#     return (pass);
# }
# 
# sub vcl_hash {
#     hash_data(req.url);
#     if (req.http.host) {
#         hash_data(req.http.host);
#     } else {
#         hash_data(server.ip);
#     }
#     return (hash);
# }
# 
# sub vcl_hit {
#     return (deliver);
# }
# 
# sub vcl_miss {
#     return (fetch);
# }
# 
# sub vcl_fetch {
#    if (beresp.ttl <= 0s ||
#        beresp.http.Set-Cookie ||
#        beresp.http.Vary == "*") {
# 		/*
# 		 * Mark as "Hit-For-Pass" for the next 2 minutes
# 		 */
#		set beresp.ttl = 120 s;
#		return (hit_for_pass);
#    }
#    return (deliver);
# }
# 
# sub vcl_deliver {
#     return (deliver);
# }
# 
# sub vcl_error {
#     set obj.http.Content-Type = "text/html; charset=utf-8";
#     set obj.http.Retry-After = "5";
#     synthetic {"
# <?xml version="1.0" encoding="utf-8"?>
# <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
#  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
# <html>
#   <head>
#     <title>"} + obj.status + " " + obj.response + {"</title>
#   </head>
#   <body>
#     <h1>Error "} + obj.status + " " + obj.response + {"</h1>
#     <p>"} + obj.response + {"</p>
#     <h3>Guru Meditation:</h3>
#     <p>XID: "} + req.xid + {"</p>
#     <hr>
#     <p>Varnish cache server</p>
#   </body>
# </html>
# "};
#     return (deliver);
# }
# 
# sub vcl_init {
# 	return (ok);
# }
# 
# sub vcl_fini {
# 	return (ok);
# }
