trigger ContactsManagerTrigger on Contact (after insert, before delete) {

    if (Trigger.isInsert) {

        List<Case> caseList = new List<Case>();

        for (Contact item : Trigger.new) {
            Case newCase = new Case();
            newCase.AccountId = item.AccountId != null ? item.AccountId : null;
        if (newCase.AccountId != null) {
            newCase.AccountId = item.AccountId;
            newCase.OwnerId = item.OwnerId;
        }

            newCase.Status = 'Working';
            newCase.Origin = 'New Contact';
            newCase.ContactId = item.Id;

            if (item.Contact_Level__c == 'Primary') {
                newCase.Priority = 'High';
            } else if (item.Contact_Level__c == 'Secondary') {
                newCase.Priority = 'Medium';
            } else if (item.Contact_Level__c == 'Tertiary') {
                newCase.Priority = 'Low';
            }

            caseList.add(newCase);
        }

        insert caseList;

    } else if (Trigger.isDelete) {

        Set<Id> ContactIDs = Trigger.oldMap.keySet();
        Case delCase = [SELECT Id FROM Case WHERE ContactId IN :ContactIDs];

        delete delCase;

    }
}