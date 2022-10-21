public class ContactsManagerController {

    @AuraEnabled
    public static List<Contact> fetchContactsData(){
        return [
                SELECT Name, Email, Contact_Level__c, Account.Name, Owner.Name, CreatedBy.Name, CreatedDate
                FROM Contact LIMIT 50000
        ];
    }

    @AuraEnabled
    public static void delContact(Contact contactRec){
        delete contactRec;
    }

}
