({
    fetchContacts : function(component, event, helper) {
        component.set('v.currentPageNumber', 1);
        component.set('v.columns', [
            {label: 'Name', fieldName:'Name', type: 'text', sortable: true},
            {label: 'Email', fieldName:'Email', type:'email', sortable: true},
            {label: 'Contact Level', fieldName: 'Contact_Level__c', type: 'text', sortable: true},
            {label: 'Account Name', fieldName: 'AccountName', type: 'text', sortable: true},
            {label: 'Owner Name', fieldName: 'OwnerName', type: 'text', sortable: true},
            {label: 'Created By', fieldName: 'CreatedByName', type: 'text', sortable: true},
            {label: 'Created Date', fieldName: 'CreatedDate', type: 'date', sortable: true,
                typeAttributes: {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
            }},
            {label: 'Del', type: 'action',
                typeAttributes: { rowActions: [{ label: 'Delete', name: 'delete' }]
            }}
        ]);
        const action = component.get('c.fetchContactsData');
        if (event.keyCode === 13 || event.button === 0) {
            component.set('v.searchValue', component.find('enter-search').get('v.value'));
        }
        const searchValue = component.get('v.searchValue');
        action.setParams({
            "searchValue": searchValue
        });
        action.setCallback(this, function(response){
            const state = response.getState();
            if (state === 'SUCCESS') {
                const records = response.getReturnValue().map((item) => {
                    if (item.Account) {
                        return Object.assign(
                            {AccountName: item.Account.Name},
                            {OwnerName: item.Owner.Name},
                            {CreatedByName: item.CreatedBy.Name},
                            item)
                    } else {
                        return Object.assign(
                            {OwnerName: item.Owner.Name},
                            {CreatedByName: item.CreatedBy.Name},
                            item)
                    }
                })
                component.set('v.initContactsList', records);
                component.set('v.contactsList', records);
                component.set('v.showSpinner', false);
                helper.preparationPagination(component, records);
            }
        });
        $A.enqueueAction(action);
    },

    sortBy: function(field, reverse, item) {
        let key = item
            ? function(x) {
                return item(x[field]);
            }
            : function(x) {
                return x[field];
            };

        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    },

    handleSort: function(component, event) {
        const sortedBy = event.getParam('fieldName');
        const sortDirection = event.getParam('sortDirection');
        const cloneData = component.get('v.contactsList');
        cloneData.sort((this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1)));
        component.set('v.contactsList', cloneData);
        component.set('v.sortDirection', sortDirection);
        component.set('v.sortedBy', sortedBy);
        this.setPaginateData(component);
    },

    preparationPagination: function (component, records) {
        const countTotalPages = Math.ceil(records.length / component.get('v.pageSize'));
        const totalPages = countTotalPages > 0 ? countTotalPages : 1;
        if (component.get('v.currentPageNumber') > totalPages) {
            component.set('v.currentPageNumber', totalPages);
        }
        component.set('v.totalPages', totalPages);
        component.set('v.totalRecords', records.length);
        this.setPaginateData(component);
    },

    setPaginateData: function(component) {
        const data = [];
        const pageNumber = component.get('v.currentPageNumber');
        const pageSize = component.get('v.pageSize');
        const contactData = component.get('v.contactsList');
        let i = (pageNumber - 1) * pageSize;
        let currentPageCount = i;
        for (i; i < (pageNumber) * pageSize; i++) {
            if (contactData[i]) {
                data.push(contactData[i]);
                currentPageCount++;
            }
        }
        component.set('v.paginationList', data);
        component.set('v.currentPageRecords', currentPageCount);
    },

    createContact: function (component, event, helper) {
        this.fetchContacts(component, event, helper)
        this.toggleModalStatus(component);
    },

    toggleModalStatus: function (component, event, helper) {
        let modalStatus = component.get('v.modal');
        modalStatus = !modalStatus;
        component.set('v.modal', modalStatus);
    },

    closeDeleteModalStatus: function (component, event, helper) {
        component.set('v.isDelete', false);
    },

    deleteContact: function (component, event, helper) {
        component.set('v.isDelete', true);
        component.set('v.contactRecord', event.getParam('row'));
    },

    confirmDelete: function (component, event, helper) {
        const contactRec = component.get('v.contactRecord');
        let action = component.get("c.delContact");
        action.setParams({
            "contactRec": contactRec
        });

        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS" ) {
                const pageNumber = component.get('v.currentPageNumber');
                const pageSize = component.get('v.pageSize');
                const data = component.get('v.contactsList');
                this.fetchContacts(component, event, helper)
                component.set('v.contactsList', data);
                component.set('v.currentPageNumber', pageNumber);
                component.set('v.pageSize', pageSize);
            }
        });
        component.set('v.isDelete', false);
        $A.enqueueAction(action);
    }

})
