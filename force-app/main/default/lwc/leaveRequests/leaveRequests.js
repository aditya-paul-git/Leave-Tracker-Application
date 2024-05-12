import { LightningElement, wire, api } from 'lwc';
import getLeaveRequests from '@salesforce/apex/LeaveRequstController.getLeaveRequests';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';
import {refreshApex} from '@salesforce/apex';

const COLUMNS=[
    {label: 'Request Id', fieldName: 'Name', cellAttributes:{class: {fieldName: 'cellClass'}}},
    {label: 'User', fieldName: 'userName', cellAttributes:{class: {fieldName: 'cellClass'}}},
    {label: 'From Date', fieldName: 'From_Date__c', cellAttributes:{class: {fieldName: 'cellClass'}}},
    {label: 'To Date', fieldName: 'To_Date__c', cellAttributes:{class: {fieldName: 'cellClass'}}},
    {label: 'Reason', fieldName: 'Reason__c', cellAttributes:{class: {fieldName: 'cellClass'}}},
    {label: 'Status', fieldName: 'Status__c', cellAttributes:{class: {fieldName: 'cellClass'}}},
    {label: 'Manager Comment', fieldName: 'Manager_Comment__c', cellAttributes:{class: {fieldName: 'cellClass'}}},
    {type: "button", typeAttributes: {
        label: 'Edit', 
        name: 'Edit', 
        title: 'Edit', 
        value: 'edit',
        disabled: {fieldName: 'isEditDisabled'}
    }, cellAttributes:{class: {fieldName: 'cellClass'}}
}
];
export default class LeaveRequests extends LightningElement {
    columns = COLUMNS;
    leaveRequests = [];
    leaveRequestsWireResult;
    showModulePopup = false;
    objectApiName = 'LeaveRequest__c';
    currentUserId = Id;
    recordId = '';
    @wire(getLeaveRequests)
    wiredLeaveRequests(result){
        this.leaveRequestsWireResult = result;
        if(result.data){
            this.leaveRequests = result.data.map(a=>({
                ...a,
                userName:a.User__r.Name,
                cellClass: a.Status__c=='Approved'?'slds-text-color_default slds-theme_success': a.Status__c=='Rejected'?'slds-theme_warning':'',
                isEditDisabled: a.Status__c!='Pending'
            }));
        }
        if(result.error){
            console.log("Error occured while fetching My Leaves - ", result.error);
        }
    }

    get noRecordFound(){
        return this.leaveRequests.length == 0;
    }

    newRequestClickHandler(){
        this.showModulePopup = true;
        this.recordId = '';
    }

    popupCloseHandler(){
        this.showModulePopup = false;
    }

    successHandler(){
        this.showModulePopup = false;
        this.showToast('Data saved successfully')
        this.refreshGrid();
    }

    showToast(message,title='success', variant='success'){
        const event = new ShowToastEvent({title, message, variant});
        this.dispatchEvent(event);
    }

    rowActionHandler(event){
        this.showModulePopup = true;
        this.recordId = event.detail.row.Id;
    }

    @api
    refreshGrid(){
        refreshApex(this.leaveRequestsWireResult);
    }
}