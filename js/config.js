/**
 * Created by ondrejvelisek on 25.3.16.
 */

var jso = new JSO({
    providerID: "perun",
    client_id: "group-manager-client-side",
    redirect_uri: "http://localhost:63342/client-side/",
    authorization: "https://perun-dev.meta.zcu.cz/krb/oauth2/authorize",
    presenttoken: "header",
});

perunRpc = "https://perun-dev.meta.zcu.cz/oauth/rpc-xvelisek";