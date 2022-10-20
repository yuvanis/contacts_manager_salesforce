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
        if (event.keyCode === 13 || event.button === 0) {
            const value = component.find('enter-search').get('v.value');
            helper.searchContact(component, value);
        }
    },

    toggleModal: function(component, event, helper) {
        helper.toggleModalStatus(component, event, helper);
    }
})
