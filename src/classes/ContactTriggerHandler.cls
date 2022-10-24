public with sharing class ContactTriggerHandler {
    private final static String CASE_STATUS_WORKING = 'Working';
    private final static String CASE_STATUS_NEW_CONTACT = 'New Contact';

    @TestVisible
    private final static Map<String, String> CONTACT_LEVEL_TO_PRIORITY = new Map<String, String>{
            'Primary' => 'High',
            'Secondary' => 'Medium',
            'Tertiary' => 'Low'
    };

    public void afterInsert(){
        createRelateCases(Trigger.new);
    }

    public void beforeDelete(){
        deleteCase((Map<Id, Contact>) Trigger.oldMap);
    }

    private void createRelateCases(List<Contact> newContacts){
        List<Case> caseList = new List<Case>();

        for (Contact item : newContacts) {
            Case newCase = new Case();
            newCase.AccountId = item.AccountId != null ? item.AccountId : null;
            if (newCase.AccountId != null) {
                newCase.AccountId = item.AccountId;
                newCase.OwnerId = item.OwnerId;
            }

            newCase.Status = CASE_STATUS_WORKING;
            newCase.Origin = CASE_STATUS_NEW_CONTACT;
            newCase.ContactId = item.Id;

            if (CONTACT_LEVEL_TO_PRIORITY.containsKey(item.Contact_Level__c)) {
                newCase.Priority = CONTACT_LEVEL_TO_PRIORITY.get(item.Contact_Level__c);
            }

            caseList.add(newCase);
        }

        insert caseList;
    }

    private void deleteCase(Map<Id, Contact> triggerMap) {
        Set<Id> ContactsId = triggerMap.keySet();
        Case delCase = [SELECT Id FROM Case WHERE ContactId IN :ContactsId];

        delete delCase;
    }

}