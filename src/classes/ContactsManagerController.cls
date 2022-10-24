public class ContactsManagerController {

    @AuraEnabled
    public static List<Contact> fetchContactsData(String searchValue){
        String value = '%'+searchValue+'%';
        return [
                SELECT Name, Email, Contact_Level__c, Account.Name, Owner.Name, CreatedBy.Name, CreatedDate
                FROM Contact
                WHERE Name LIKE :value
                LIMIT 50000
        ];
    }

    @AuraEnabled
    public static void deleteContact(Contact contactRec){
        delete contactRec;
    }

}
