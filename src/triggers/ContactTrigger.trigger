trigger ContactTrigger on Contact (after insert, before delete) {
    private ContactTriggerHandler contactTriggerHandler = new ContactTriggerHandler();

    if (Trigger.isInsert && Trigger.isAfter) {
        contactTriggerHandler.afterInsert();
    }

    if (Trigger.isDelete && Trigger.isBefore) {
        contactTriggerHandler.beforeDelete();
    }
}