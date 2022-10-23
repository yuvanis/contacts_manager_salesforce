@IsTest
private class ContactsManagerControllerTest {

    @TestSetup
    static void setup() {

        List<Contact> testContacts = new List<Contact>();
        for (Integer i = 0; i < 10; i++) {
            Contact testContact = new Contact(
                    FirstName = 'Test[i]',
                    LastName = 'Test',
                    Email = 'test@gmail.com',
                    Contact_Level__c = 'Primary'
            );
            testContacts.add(testContact);
        }
        insert testContacts;

    }

    @IsTest
    static void testSearch() {

        List<Contact> contactsList1 = ContactsManagerController.fetchContactsData('');
        System.assertEquals(10, contactsList1.size());
        List<Contact> contactsList2 = ContactsManagerController.fetchContactsData('e');
        System.assertEquals(10, contactsList2.size());
    }

    @IsTest
    static void testDelete() {

        Contact deleteContact = [SELECT Name FROM Contact LIMIT 1];
        ContactsManagerController.delContact(deleteContact);
        String nameContact = deleteContact.Id;

        List<Contact> searchDelContact = [SELECT Id FROM Contact WHERE Id = :nameContact];
        System.assertEquals(0, searchDelContact.size());
        List<Contact> contactsList = [SELECT Name FROM Contact];
        System.assertEquals(9, contactsList.size());
    }

}