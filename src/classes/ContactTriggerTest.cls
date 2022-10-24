@IsTest
private class ContactTriggerTest {

    @IsTest
    static void testTrigger() {

        Account testAccount = new Account(Name='TestAccount');
        insert testAccount;

        List<Contact> contactsList = new List<Contact>();
        Contact con1 = new Contact(FirstName = 'Test1', LastName = 'Test1', Email = 'test1@gmail.com',
                Contact_Level__c = 'Primary', AccountId = testAccount.Id);
        Contact con2 = new Contact(FirstName = 'Test2', LastName = 'Test2', Email = 'test2@gmail.com',
                Contact_Level__c = 'Secondary', AccountId = testAccount.Id);
        Contact con3 = new Contact(FirstName = 'Test3', LastName = 'Test3', Email = 'test3@gmail.com',
                Contact_Level__c = 'Tertiary', AccountId = testAccount.Id);

        contactsList.add(con1);
        contactsList.add(con2);
        contactsList.add(con3);

        insert contactsList;
        List<Contact> result = [
                SELECT Id, AccountId, Account.OwnerId, Contact_Level__c,
                (SELECT Id, OwnerId, Status, Origin, Priority, ContactId, AccountId FROM Cases)
                FROM Contact
        ];

        for (Contact contact : result) {
            for (Case newCase : contact.Cases){
                System.assertEquals(contact.Id, newCase.ContactId);
                System.assertEquals(contact.AccountId, newCase.AccountId);
                System.assertEquals(contact.Account.OwnerId, newCase.OwnerId);
                System.assertEquals('Working', newCase.Status);
                System.assertEquals('New Contact', newCase.Origin);
                System.assertEquals(ContactTriggerHandler.CONTACT_LEVEL_TO_PRIORITY.get(contact.Contact_Level__c), newCase.Priority);
            }
        }

        Contact deleteContact = [SELECT Id FROM Contact LIMIT 1];
        String nameContact = deleteContact.Id;
        delete deleteContact;

        List<Contact> searchDelContact = [SELECT Id FROM Contact WHERE Id = :nameContact];
        System.assertEquals(0, searchDelContact.size());
        List<Contact> contactsDeleteList = [SELECT Name FROM Contact];
        System.assertEquals(2, contactsDeleteList.size());
        System.assertNotEquals(contactsList, contactsDeleteList);
    }

}