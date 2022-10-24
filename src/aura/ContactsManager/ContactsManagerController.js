({
    init: function(component, event, helper) {
        helper.fetchContacts(component, event, helper);
    },

    handleSort: function(component, event, helper) {
        helper.handleSort(component, event, helper);
    },

    handleNext: function(component, event, helper){
        component.set('v.currentPageNumber', component.get('v.currentPageNumber') + 1);
        helper.setPaginateData(component);
    },

    handlePrevious: function(component, event, helper){
        component.set('v.currentPageNumber', component.get('v.currentPageNumber') - 1);
        helper.setPaginateData(component);
    },

    toFirst: function(component, event, helper) {
        component.set('v.currentPageNumber', 1);
        helper.setPaginateData(component);
    },

    toLast: function(component, event, helper) {
        component.set('v.currentPageNumber', component.get('v.totalPages'));
        helper.setPaginateData(component);
    },

    startSearch: function (component, event, helper) {
        helper.fetchContacts(component, event, helper);
    },

    toggleModal: function(component, event, helper) {
        helper.toggleModalStatus(component, event, helper);
    },

    closeDeleteModal: function(component, event, helper) {
        component.set('v.isDelete', false);
    },

    createNewContact: function(component, event, helper) {
        helper.fetchContacts(component, event, helper);
        helper.toggleModalStatus(component, event, helper);
        helper.showCreateMessage();
    },

    handleRowAction: function(component, event, helper) {
        helper.deleteContact(component, event, helper);
    },

    submitDelete: function(component, event, helper) {
        helper.confirmDelete(component, event, helper);
    },

})
