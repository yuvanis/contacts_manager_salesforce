({
    fetchContacts : function(component, event, helper) {
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
            }}
        ]);
        const action = component.get('c.fetchContactsData');
        action.setParams({
        });
        action.setCallback(this, function(response){
            const state = response.getState();
            if (state === 'SUCCESS') {
                const records = response.getReturnValue().map((item) => {
                    return Object.assign(
                        // {AccountName: item.Account.Name},
                        {OwnerName: item.Owner.Name},
                        {CreatedByName: item.CreatedBy.Name},
                        item)
                })
                component.set('v.initContactsList', records);
                component.set('v.contactsList', records);
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
        component.set('v.currentPageNumber', 1);
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

    searchContact: function (component, value) {
        const data = component.get('v.initContactsList');
        const newData = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].Name.toLocaleLowerCase().includes(value.toLowerCase())) {
                newData.push(data[i]);
            }
        }
        component.set('v.contactsList', newData);
        this.preparationPagination(component, newData);
    },

    toggleModalStatus: function (component, event, helper) {
        let modalStatus = component.get('v.modal');
        modalStatus = !modalStatus;
        component.set('v.modal', modalStatus);
    }

})
