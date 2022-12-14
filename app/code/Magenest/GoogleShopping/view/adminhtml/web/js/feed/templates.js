define([
    "jquery",
    "ko",
    "uiComponent",
    'underscore',
    'mageUtils',
    'Magento_Ui/js/modal/alert'
], function ($, ko, Component, _, utils,alert) {
    "use strict";

    ko.bindingHandlers.option = {
        update: function(element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            ko.selectExtensions.writeValue(element, value);
        }
    };

    function Template(data) {
        var self = this;
        self.id = ko.observable(data.id);
        self.magento_attribute = ko.observable(data.magento_attribute);
        self.google_attribute = ko.observable(data.google_attribute);
        self.status = ko.observable(data.status);
    }

    function TemplateModel(config)
    {
        var self = this;
        self.templateMapping = ko.observableArray([]);
        self.magentoFields = ko.observableArray([]);
        self.googleFields = ko.observableArray([]);
        var templateData = config.attributes.mapped_fields;
        var map = $.map(templateData, function (data) {
            return new Template(data);
        });
        self.templateMapping(map);
        self.magentoFields(config.attributes.magento_attribute);
        self.googleFields(config.attributes.google_attribute);
        self.setOptionDisable = function (option, item){
            ko.applyBindingsToNode(option, {disable: item.disable}, item);
        }
        self.addAttribute = function (){
            var optionIds = $.map(self.templateMapping(), function (template) {
                return template.id();
            });
            var maxId = 0;
            if (optionIds != '' || optionIds.length > 0) {
                maxId = Math.max.apply(this, optionIds);
                maxId++;
            }
            self.templateMapping.push(new Template({
                id: maxId,
                magento_attribute: '',
                google_attribute: ''
            }))
        }
        self.deleteAttribute = function (templateMapping){
            ko.utils.arrayForEach(self.templateMapping(),function (template) {
                if(templateMapping.id() == template.id()){
                    self.templateMapping.remove(template);
                }
            });
        }
    }

    return Component.extend({
        defaults: {
            template: "Magenest_GoogleShopping/view/feed/template",
            magentoFields: ko.observableArray([]),
            googleshoppingAttribute: ko.observableArray([]),
            mappingResult: ko.observableArray([]),
            saveMappingUrl: '',
            templateName: '',
        },

        /**
         * Calls 'initObservable' of parent
         *
         * @returns {Object} Chainable.
         */
        initObservable: function () {
            this._super();
            return this;
        },

        /**
         * @inheritdoc
         */
        initialize: function (config) {
            this._super;
            var self = this;
            this.initConfig(config);
            this.bindAction(self);
            self.saveMappingUrl = config.attributes.save_mapping_url;
            self.templateName = config.attributes.template_name;
            return this;
        },

        bindAction: function (self) {
            var config = self;
            ko.cleanNode(document.getElementById("template_attributes"));
            ko.applyBindings(new TemplateModel(config),document.getElementById("template_attributes"));
        },

        saveMapping: function () {
            var self = this,
                saveMappingUrl = self.saveMappingUrl;
            $('.admin__table-secondary > tbody > tr').each(function () {
                var id = $(this).find(".attribute_id");
                var cells = $(this).find(".magento_product_attribute");
                var select = $(this).find('.google_product_attribute');
                var status = $(this).find('.select_status');
                if (select.val()) {
                    self.mappingResult.push({
                        id: id.val(),
                        magento_attribute: cells.val(),
                        google_attribute: select.val(),
                        status: status.val()
                    });
                }
            });
            if (self.mappingResult().length) {
                var name = $("#template_name").val(),
                    templateId = $("#template_id").val();
                $.ajax({
                    type: "POST",
                    url: saveMappingUrl,
                    data: {
                        id: templateId,
                        template_mapping: self.mappingResult(),
                        template_name: name,
                        form_key: FORM_KEY
                    },
                    beforeSend: function () {
                        $('body').trigger('processStart');
                    },
                    success: function (response) {
                        $('body').trigger('processStop');
                        if (response.flag) {
                            window.location.href =  response.url;
                        }else{
                            alert({
                                content: response.message
                            });
                            window.location.href =  response.url;
                        }
                    },
                    error: function (response) {
                        $('body').trigger('processStop');
                        alert({
                            content: response.message
                        });
                    }
                });
            }else{
                alert({
                    content: 'No field mapping has been selected.'
                });
                $('body').trigger('processStop');
            }
        }
    });
});
