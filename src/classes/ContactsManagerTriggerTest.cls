@IsTest
private class ContactsManagerTriggerTest {

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

        List<Case> casesList = [SELECT Id, Owner.Name, Status, Origin, Priority, ContactId, AccountId FROM Case];

        System.assertEquals(true, casesList.size()!=null);
        System.assertEquals(3, casesList.size());

        Case case0 = casesList.get(0);
        Case case1 = casesList.get(1);
        Case case2 = casesList.get(2);

        System.assertEquals(con1.Id, case0.ContactId);
        System.assertEquals(con2.Id, case1.ContactId);
        System.assertEquals(con3.Id, case2.ContactId);

        System.assertEquals(testAccount.Id, case0.AccountId);
        System.assertEquals(testAccount.Id, case1.AccountId);
        System.assertEquals(testAccount.Id, case2.AccountId);

        System.assertEquals(testAccount.Owner.Name, case0.Owner.Name);
        System.assertEquals(testAccount.Owner.Name, case1.Owner.Name);
        System.assertEquals(testAccount.Owner.Name, case2.Owner.Name);

        System.assertEquals('Working', case0.Status);
        System.assertEquals('Working', case1.Status);
        System.assertEquals('Working', case2.Status);

        System.assertEquals('New Contact', case0.Origin);
        System.assertEquals('New Contact', case1.Origin);
        System.assertEquals('New Contact', case2.Origin);

        System.assertEquals('High', case0.Priority);
        System.assertEquals('Medium', case1.Priority);
        System.assertEquals('Low', case2.Priority);


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