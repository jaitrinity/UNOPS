import { Component, OnInit } from '@angular/core';
import { Constant } from '../shared/constant/Contant';
import { CommonFunction } from '../shared/service/CommonFunction';
import { EmployeeTableSetting } from '../shared/tableSettings/EmployeeTableSetting';
import { Router } from '@angular/router';
import { SharedService } from '../shared/service/SharedService';
import { ToastrService } from 'ngx-toastr';
import { LayoutComponent } from '../layout/layout.component';
declare var $: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  
  alertFadeoutTime = 0;
  roleList = [];
  selectedRoleList = [];
  employeeList = [];
  employeeName = "";
  mobile = "";
  emailId = "";
  
  editSelectedRoleList = [];
  editEmployeeName = "";
  editMobile = "";
  editEmailId = "";

  isDoAnyChange : boolean = true;
  employeeTableSettings = EmployeeTableSetting.setting;
  tenentId = "";
  loginEmpId = "";
  loginEmpRole = "";
  button = "";
  color1 = "";
  color2 = "";
  multiSelectdropdownSettings = {};
  singleSelectdropdownSettings = {};
  constructor(private router: Router,private sharedService : SharedService,
    private toastr: ToastrService, private layoutComponent : LayoutComponent) { 
      this.loginEmpId = localStorage.getItem("empId");
      this.loginEmpRole = localStorage.getItem("loginEmpRole");
      this.alertFadeoutTime = Constant.ALERT_FADEOUT_TIME;
      this.tenentId = localStorage.getItem("tenentId");
      this.button = localStorage.getItem("button");
      this.color1 = localStorage.getItem("color1");
      this.color2 = localStorage.getItem("color2");
      this.layoutComponent.setPageTitle("UN OPS | Employee");
    }

  ngOnInit() {
    this.multiSelectdropdownSettings = {
      singleSelection: false,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 0,
      allowSearchFilter: true
    };
    this.singleSelectdropdownSettings = {
      singleSelection: true,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection : true
    };
    setTimeout(() => {
      $("ng2-smart-table thead").css('background-color',this.color1);
    }, 100);
    
    this.getAllList();
    this.getAllEmployeeList();
  }
  
  
  makeBlank(fieldId){
    $(fieldId).val("");
  }
  

  getAllList(){
    this.sharedService.getAllList('employee', this.tenentId)
    .subscribe((response) =>{
      // console.log(response);
      this.roleList = response.roleList;
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getAllList"),"Alert !",{timeOut : this.alertFadeoutTime});
    });
  }

  getAllEmployeeList(){
    this.employeeList = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      tenentId : this.tenentId,
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.getAllListBySelectType(jsonData,"employee")
    .subscribe((response) =>{
      // console.log(response);
      this.employeeList = response.employeeList;
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("submitAssignData"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    });
  }

  validateEmailid(emailIdValue : any){
    var email = emailIdValue;
    var atpos=email.indexOf("@");
    var dotpos=email.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length)
    {		
        return false;
    }
    else
    {
        return true;
    }
  }

  submitEmployeeData(){
    if(this.employeeName == ""){
      this.toastr.warning("please enter employeeName value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.selectedRoleList.length == 0){
      this.toastr.warning("please select one role","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.mobile == ""){
      this.toastr.warning("please enter mobile value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.mobile.length != 10){
      this.toastr.warning("mobile length should be 10 digit","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.emailId == ""){
      this.toastr.warning("please enter email id","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(!this.validateEmailid(this.emailId)){
      this.toastr.warning("please enter valid email id","Alert !",{timeOut : this.alertFadeoutTime})
      return;
    }

    let roleIds = CommonFunction.createCommaSeprate(this.selectedRoleList);

    let jsonData = {
      employeeName : this.employeeName,
      roleId : roleIds,
      mobile : this.mobile,
      emailId : this.emailId,
      fieldUser : 1,
      tenentId : this.tenentId
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.submitDataByInsertType(jsonData,'employee')
    .subscribe((response) =>{
      //console.log(response);
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        this.setDefaultAllField();
        this.getAllEmployeeList();
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("submitEmployeeData"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    });
  }

  setDefaultAllField(){
    this.employeeName = ""
    this.selectedRoleList = [];
    this.mobile = "";
    this.emailId = "";

    this.editableEmployeeId = "";
    this.editEmployeeName = ""
    this.editSelectedRoleList = [];
    this.editMobile = "";
    this.editEmailId = "";
  }

  onCustomAction(event) {
    switch ( event.action) {
      case 'activerecord':
        this.actionOnEmployee(event,1);
        break;
     case 'deactiverecord':
        this.actionOnEmployee(event,0);
        break;
      case 'editrecord':
        this.editEmployee(event);
        break;
    }
  }

  actionOnEmployee(event,action){
    let actionType = action == 1 ? "Activate" : "Deactivate";
    let isConfirm = confirm("Do you want to "+actionType+" this?");
    if(isConfirm){
      let id = event.data.id;
      let jsonData = {
        id : id,
        action : action
      }
      this.layoutComponent.ShowLoading = true;
      this.sharedService.updateDataByUpdateType(jsonData,"employee")
      .subscribe((response) =>{
        if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
          this.getAllEmployeeList();
        }
        else{
          this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        }
        this.layoutComponent.ShowLoading = false;
        
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("submitAssignData"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      });
    }
  }

  editableId = "";
  editableEmployeeId = "";
  editEmployee(event){
    this.isDoAnyChange = true;
    this.editSelectedRoleList = [];
    this.editableId = event.data.id;
      this.editableEmployeeId = event.data.empId;
      for(let i=0;i<this.employeeList.length;i++){
        let iid = this.employeeList[i].id;
        if(iid == this.editableId){
          this.editEmployeeName = this.employeeList[i].empName;
          this.editMobile = this.employeeList[i].mobile;
          this.editEmailId = this.employeeList[i].emailId;
          let roleId = this.employeeList[i].roleId;
          for(let j=0;j<this.roleList.length;j++){
            let roleIdParamCode = this.roleList[j].paramCode;
            if(roleIdParamCode == roleId){
              this.editSelectedRoleList.push(this.roleList[j]);
              break;
            }
          }
          
          break;
        }
      }

      //console.log(this.editSelectedRoleList);

      $("#editEmployeeModal").modal({
        backdrop : 'static',
        keyboard : false
      });
    }

    closeModal(){
      if(!this.isDoAnyChange){
        let isConfirm = confirm("Do you want to close?");
        if(isConfirm){
          $("#editEmployeeModal").modal("hide");
        }
      }
      else{
        $("#editEmployeeModal").modal("hide");
      }
      
    }

  editEmployeeData(){
    if(this.editEmployeeName == ""){
      this.toastr.warning("please enter employeeName value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editSelectedRoleList.length == 0){
      this.toastr.warning("please select one role","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editMobile == ""){
      this.toastr.warning("please enter mobile value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editMobile.length != 10){
      this.toastr.warning("mobile length should be 10 digit","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editEmailId == ""){
      this.toastr.warning("please enter email id","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(!this.validateEmailid(this.editEmailId)){
      this.toastr.warning("please enter valid email id","Alert !",{timeOut : this.alertFadeoutTime})
      return;
    }
    
    let isConfirm = confirm("Do you want to save new  info ?");
    if(!isConfirm){
      return ;
    }
    let roleIds = CommonFunction.createCommaSeprate(this.editSelectedRoleList);
    let jsonData = {
      id : this.editableId,
      employeeId : this.editableEmployeeId,
      employeeName : this.editEmployeeName,
      roleId : roleIds,
      mobile : this.editMobile,
      emailId : this.editEmailId,
      fieldUser : 1
    }
    //console.log(JSON.stringify(jsonData));
    this.layoutComponent.ShowLoading = true;
    this.sharedService.updateDataByUpdateType(jsonData,"editEmployee")
    .subscribe((response) =>{
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        $("#editEmployeeModal").modal("hide");
        this.setDefaultAllField();
        this.getAllEmployeeList();
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("editEmployeeData"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    });
  }
  
  closeAnyModal(modalName){
    $("#"+modalName).modal("hide");
  }
  changeSelected(e){
    $("#createEmployeeModal").modal({
      backdrop : 'static',
      keyboard : false
    });
  }
 
}
