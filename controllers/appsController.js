/**
 * Created by JetBrains WebStorm.
 * User: kelly
 * Date: 12/01/2012
 * Time: 19:41
 * To change this template use File | Settings | File Templates.
 * Author: Craig Brookes
 */

var appsController,
    renderer    = require("../util"),
    fhc         = require("fh-fhc");

appsController = {
    indexAction : function (req,res) {
        var json, data;
        json = (req.params.json && req.params.json === "json") ? true : false;
        fhc.apps([], function (err, data) {
            if (err) {
                renderer.doError(res, req, "Couldn't generate apps listing");
                return;
            }
            var d = {
                tpl:'apps',
                apps:data.list,
                title:'Apps',
            };
            renderer.doResponse(req, res, json, d);
        });
    },
    performoperationAction : function (req,res){
        var json, id = req.params.id,
            operation = req.params.operation,
            subOp = req.params.subOp;
        json = (req.params.json && req.params.json === "json") ? true : false;
        // We have an ID - show an individual app
        fhc.apps([id], function (err, data) {
            if (err) {
                renderer.doError(res,req, "Couldn't find app with id" + id);
                return;
            }
            if (!operation) {
                operation = 'appDashboard';
            }
            // show tab relating to this operation
            if (operation === "editor") {
                fhc.files(['list', id], function (err, root) {
                    if (err) {
                        renderer.doError(res,req, "Error retrieving files list");
                        return; // TODO: Show error logging out page
                    }
                    var list = JSON.stringify(root);

                    if (subOp) {
                        fhc.files(['read', subOp], function (err, file) {
                            if (err) {
                                renderer.doError(res,req, "Error loading file " + file);
                                return; // TODO: Show error logging out page
                            }
                            var d = {
                                title:file.fileName,
                                tpl:'app',
                                data:data,
                                tab:operation,
                                filesTree:list,
                                file:file.contents,
                                mode:'js'
                            };
                            renderer.doResponse(req, res, json, d);
                        });
                    } else {
                        var d = {
                            title:'Editor',
                            tpl:'app',
                            data:data,
                            tab:operation,
                            filesTree:list,
                            file:false,
                            mode:'js'
                        };
                        renderer.doResponse(req, res, json, d);
                    }
                });//end fhc call

            } else {
                var d = {
                    tpl:'app',
                    title:'Login',
                    data:data,
                    tab:operation
                };
                renderer.doResponse(req, res, json, d);
            }
        });

    }
};


module.exports = appsController;