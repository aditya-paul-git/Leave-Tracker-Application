import { LightningElement, wire } from 'lwc';
import getMyLeaves from '@salesforce/apex/LeaveRequstController.getMyLeaves';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';
import {refreshApex} from '@salesforce/apex';

const COLUMNS=[
    {label: 'Request Id', fieldName: 'Name', cellAttributes:{class: {fieldName: 'cellClass'}}},
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
export default class MyLeaves extends LightningElement {
    columns = COLUMNS;
    myLeaves = [];
    myLeavesWireResult;
    showModulePopup = false;
    objectApiName = 'LeaveRequest__c';
    currentUserId = Id;
    recordId = '';
    @wire(getMyLeaves)
    wiredMyLeaves(result){
        this.myLeavesWireResult = result;
        if(result.data){
            this.myLeaves = result.data.map(a=>({
                ...a,
                cellClass: a.Status__c=='Approved'?'slds-text-color_default slds-theme_success': a.Status__c=='Rejected'?'slds-theme_warning':'',
                isEditDisabled: a.Status__c!='Pending'
            }));
        }
        if(result.error){
            console.log("Error occured while fetching My Leaves - ", result.error);
        }
    }

    get noRecordFound(){
        return this.myLeaves.length == 0;
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
        refreshApex(this.myLeavesWireResult);
    }

    showToast(message,title='success', variant='success'){
        const event = new ShowToastEvent({title, message, variant});
        this.dispatchEvent(event);
    }

    rowActionHandler(event){
        this.showModulePopup = true;
        this.recordId = event.detail.row.Id;
    }

    submitHandler(event){
        event.preventDefault();
        const fields = {...event.detail.fields};
        fields.Status__c = 'Pending';
        if(new Date(fields.From_Date__c) > new Date(fields.To_Date__c)){
            this.showToast('From date should be greater than To date','Error','error');
        }
        else if(new Date() > new Date(fields.From_Date__c)){
            this.showToast('From date should be less than Today','Error','error');
        }
        else{
            this.refs.leaveRequestFrom.submit(fields);
        }
    }
} 