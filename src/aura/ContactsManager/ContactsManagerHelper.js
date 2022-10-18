({
    fetchContacts : function(component, event, helper) {
        component.set('v.columns', [
            {label: 'Name', fieldName:'Name', type: 'text'},
            {label: 'Email', fieldName:'Email', type:'email'},
            {label: 'Contact Level', fieldName: 'Contact_Level__c', type: 'text'},
            {label: 'Account Name', fieldName: 'AccountName', type: 'text'},
            {label: 'Owner Name', fieldName: 'OwnerName', type: 'text'},
            {label: 'Created By', fieldName: 'CreatedByName', type: 'text'},
            {label: 'Created Date', fieldName: 'CreatedDate', type: 'date',
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
    }
})