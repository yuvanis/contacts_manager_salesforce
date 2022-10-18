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
        const action = component.get("c.fetchContactsData");
        action.setParams({
        });
        action.setCallback(this, function(response){
            const state = response.getState();
            if (state === "SUCCESS") {
                const result = response.getReturnValue().map((item) => {
                    return Object.assign(
                        {AccountName: item.Account.Name},
                        {OwnerName: item.Owner.Name},
                        {CreatedByName: item.CreatedBy.Name},
                        item)
                })
                component.set("v.contactsList", result);
            }
        });
        $A.enqueueAction(action);
    },

    sortBy: function(field, reverse, example) {
        let key = example
            ? function(x) {
                return example(x[field]);
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
        const cloneData = component.get("v.contactsList");
        cloneData.sort((this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1)));
        component.set('v.contactsList', cloneData);
        component.set('v.sortDirection', sortDirection);
        component.set('v.sortedBy', sortedBy);
    }

})
