@IsTest
private class ContactsManagerControllerTest {

    @TestSetup
    static void setup() {

        List<Contact> testContacts = new List<Contact>();
        for (Integer i = 0; i < 10; i++) {
            Contact testContact = new Contact(
                    FirstName = 'Test' + i,
                    LastName = 'Test',
                    Email = 'test@gmail.com',
                    Contact_Level__c = 'Primary'
            );
            testContacts.add(testContact);

        }
        insert testContacts;

    }

    @IsTest
    static void testFetchContactsData() {

        List<Contact> contactsList1 = ContactsManagerController.fetchContactsData('');
        System.assertEquals(10, contactsList1.size());
        List<Contact> contactsList2 = ContactsManagerController.fetchContactsData('Test0');
        System.assertEquals(1, contactsList2.size());
    }

    @IsTest
    static void testDeleteContact() {

        Contact contactForDelete = [
                SELECT Name
                FROM Contact
                LIMIT 1
        ];
        ContactsManagerController.deleteContact(contactForDelete);
        String nameContact = contactForDelete.Id;

        List<Contact> searchDelContact = [
                SELECT Id
                FROM Contact
                WHERE Id = :nameContact
        ];
        System.assertEquals(0, searchDelContact.size());
        List<Contact> contactsList = [
                SELECT Name
                FROM Contact
        ];
        System.assertEquals(9, contactsList.size());
    }

}