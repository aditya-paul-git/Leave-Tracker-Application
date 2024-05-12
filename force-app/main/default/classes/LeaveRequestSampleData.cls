public with sharing class LeaveRequestSampleData {
    public static void createData(){
        Id currentUserId=UserInfo.getUserId();
        List<LeaveRequest__c> leaves=new List<LeaveRequest__c>();
        leaves.Add(new LeaveRequest__c(User__c=currentUserId,From_Date__c=Date.newInstance(2024, 05, 10),To_Date__c=Date.newInstance(2024, 05, 10),Reason__c='Sick Leave',Status__c='Approved'));
        leaves.Add(new LeaveRequest__c(User__c=currentUserId,From_Date__c=Date.newInstance(2024, 05, 15),To_Date__c=Date.newInstance(2024, 05, 15),Reason__c='Medical Checkup',Status__c='Pending'));
        leaves.Add(new LeaveRequest__c(User__c=currentUserId,From_Date__c=Date.newInstance(2024, 05, 20),To_Date__c=Date.newInstance(2024, 05, 20),Reason__c='For personal reason',Status__c='Rejected'));
        leaves.Add(new LeaveRequest__c(User__c=currentUserId,From_Date__c=Date.newInstance(2024, 05, 01),To_Date__c=Date.newInstance(2024, 05, 02),Reason__c='Sick Leave',Status__c='Approved'));
        leaves.Add(new LeaveRequest__c(User__c=currentUserId,From_Date__c=Date.newInstance(2024, 05, 05),To_Date__c=Date.newInstance(2024, 05, 05),Reason__c='Sick Leave',Status__c='Approved'));
        
        insert leaves;
    }
}