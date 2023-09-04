import { Component, OnInit } from '@angular/core';
import { Constant } from '../shared/constant/Contant';
import { LocationTableSetting } from '../shared/tableSettings/LocationTableSetting';
import { SharedService } from '../shared/service/SharedService';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { CommonFunction } from '../shared/service/CommonFunction';
import { EmpLocMappingTableSetting } from '../shared/tableSettings/EmpLocMappingTableSetting';
import { EmpLocMappingNonEditTableSetting } from '../shared/tableSettings/EmpLocMappingNonEditTableSetting';
import { LayoutComponent } from '../layout/layout.component';
declare var $: any;

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  state = ""
  city = "";
  area = "";
  name = "";
  address = "";

  isState : boolean = false;
  stateList = [];
  selectedStateList = [];

  isCity : boolean = false;
  cityList = [];
  selectedCityList = [];

  isArea : boolean = false;
  areaList = [];
  selectedAreaList = [];

  isName : boolean = false;
  nameList = [];
  selectedNameList = [];

  isAddress : boolean = false;
  addressList = [];
  selectedAddressList = [];

  

  roleList = [];
  selectedRoleList = [];

  employeeList = [];
  selectedEmployeeList = [];
  
  isNew : boolean = true;
  alertFadeoutTime = 0;
  locationList = [];
  locationTableSettings = LocationTableSetting.setting;
  empLocMappingList = [];
  empLocMappingTableSettings = EmpLocMappingTableSetting.setting;
  empLocMappingNonEditTableSettings = EmpLocMappingNonEditTableSetting.setting;
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
      this.layoutComponent.setPageTitle("UN OPS | Location");
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
      $(".location_GeoCoordinate").attr("title","Click me to show ? details.");
      $(".location_GeoCoordinate").click(function(){
        $("#locationInfoModal").modal({
          backdrop : 'static',
          keyboard : false
        });
      })
    }, 100);
    
    this.getAllLocationList();
    this.getEmpLocMappingList();
  }

  onSelectOrDeselectState(item){
  }
  onSelectOrDeselectCity(item){
  }
  onSelectOrDeselectArea(item){}

  onSelectAllOrDeselectAllCity(item){
  }
  onSelectAllOrDeselectAllArea(item){}
  onSelectOrDeselectRole(item){
    this.employeeList = [];
    this.selectedEmployeeList = [];
    // if(this.selectedStateList.length == 0 || this.selectedRoleList.length == 0){
    //   return ;
    // }
    this.getEmployeeByCircleAndRole();
  }

  getEmpLocMappingList(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      tenentId : this.tenentId
    }
    this.sharedService.getAllListBySelectType(jsonData,"EmpLocMapping")
    .subscribe((response) =>{
      this.empLocMappingList = response.empLocMappingList;
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getEmpLocMappingList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    });
  }

  getEmployeeByCircleAndRole(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      tenentId : this.tenentId,
      role : CommonFunction.createCommaSeprate(this.selectedRoleList)
    }

    this.layoutComponent.ShowLoading = true;
    this.sharedService.getAllListBySelectType(jsonData,"EmployeeByCircleAndRole")
    .subscribe((response) =>{
      //console.log(response);
      this.employeeList = response.employeeList;
      if(this.employeeList.length == 0){
        this.toastr.warning("Employee not found as per select criteria","Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getAllRoleList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  makeBlank(fieldId){
    $(fieldId).val("");
  }

  getAllList(){
    this.sharedService.getAllList('location', this.tenentId)
    .subscribe((response) =>{
      // console.log(response);
      this.roleList = response.roleList;
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getAllList"),"Alert !",{timeOut : this.alertFadeoutTime});
    });
  }

  closeModal(){
    $("#locationInfoModal").modal("hide");
  }
  
  getAddressByLatLong(latLong:string){
    this.sharedService.getAddressByLatLong(latLong)
    .subscribe((response) =>{
      // console.log(response);
      this.address = response.results[0].formatted_address;
      // console.log(this.address)
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getAddressByLatLong"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    });
  }
  updateRouterSequence(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      currentRouter : this.router.url
    }
    this.sharedService.updateDataByUpdateType(jsonData,'routerSequence')
    .subscribe((response) =>{
      // console.log(response);
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("updateRouterSeq"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    });
  }
  getAllLocationList(){
    this.locationList = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      tenentId : this.tenentId
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.getAllListBySelectType(jsonData,'location')
    .subscribe((response) =>{
      // console.log(response);
      this.locationList = response.locationList;
      this.layoutComponent.ShowLoading = false;
      let tempStateList = [];
      let tempCityList = [];
      let tempAreaList = [];
      let tempNameList = [];
      let tempAddressList = [];
      for(let i=0;i<this.locationList.length;i++){
        let locObj = this.locationList[i];
        // ----------- State ------------------
        let state = locObj.state;
        if(tempStateList.length == 0){
          let json = {
            paramCode: state, paramDesc: state+' '
          }
          tempStateList.push(json);
        }
        else{
          let isExist = tempStateList.filter(x => x.paramCode == state);
          if(isExist.length == 0){
            let json = {
              paramCode: state, paramDesc: state+' '
            }
            tempStateList.push(json);
          }
        }
        // ----------- City ------------------
        let city = locObj.city;
        if(tempCityList.length == 0){
          let json = {
            paramCode: city, paramDesc: city+' '
          }
          tempCityList.push(json);
        }
        else{
          let isExist = tempCityList.filter(x => x.paramCode == city);
          if(isExist.length == 0){
            let json = {
              paramCode: city, paramDesc: city+' '
            }
            tempCityList.push(json);
          }
        }
        // ----------- Area ------------------
        let area = locObj.area;
        if(tempAreaList.length == 0){
          let json = {
            paramCode: area, paramDesc: area+' '
          }
          tempAreaList.push(json);
        }
        else{
          let isExist = tempAreaList.filter(x => x.paramCode == area);
          if(isExist.length == 0){
            let json = {
              paramCode: area, paramDesc: area+' '
            }
            tempAreaList.push(json);
          }
        }
        // ----------- Name ------------------
        let name = locObj.name;
        if(tempNameList.length == 0){
          let json = {
            paramCode: name, paramDesc: name+' '
          }
          tempNameList.push(json);
        }
        else{
          let isExist = tempNameList.filter(x => x.paramCode == name);
          if(isExist.length == 0){
            let json = {
              paramCode: name, paramDesc: name+' '
            }
            tempNameList.push(json);
          }
        }
        // ----------- Addres ------------------
        let address = locObj.address;
        if(tempAddressList.length == 0){
          let json = {
            paramCode: address, paramDesc: address+' '
          }
          tempAddressList.push(json);
        }
        else{
          let isExist = tempAddressList.filter(x => x.paramCode == address);
          if(isExist.length == 0){
            let json = {
              paramCode: address, paramDesc: address+' '
            }
            tempAddressList.push(json);
          }
        }
        
      }
      this.stateList = tempStateList;
      this.cityList = tempCityList;
      this.areaList = tempAreaList;
      this.nameList = tempNameList;
      this.addressList = tempAddressList;
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("submitAssignData"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
    });
  }

  submitLocationData(){
    if(this.state.trim() == ""){
      this.toastr.warning("please enter Division ","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.city.trim() == ""){
      this.toastr.warning("please enter District ","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.area.trim() == ""){
      this.toastr.warning("please enter Block ","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.name.trim() == ""){
      this.toastr.warning("please enter Gram panchayat","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.address.trim() == ""){
      this.toastr.warning("please enter Village","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    
    let jsonData = {
      state : this.state.trim(),
      city : this.city.trim(),
      area : this.area.trim(),
      name : this.name.trim(),
      address : this.address.trim(),
      tenentId : this.tenentId
    }
    // console.log(JSON.stringify(jsonData));
    this.layoutComponent.ShowLoading = true;
    this.sharedService.submitDataByInsertType(jsonData,"location")
    .subscribe((response) =>{
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        this.setDefaultToField();
        this.getAllLocationList();
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("submit location data"),"Alert !",{timeOut : this.alertFadeoutTime});
      this.layoutComponent.ShowLoading = false;
    });

  }

  submitEmpLocMappingData(actionType : string){
    if(this.isState == false && this.isCity == false && this.isArea == false && this.isName == false && this.isAddress == false){
      this.toastr.warning("please check one type","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    if(this.isState && this.selectedStateList.length == 0){
      this.toastr.warning("please select a Division","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.isCity && this.selectedCityList.length == 0){
      this.toastr.warning("please select a District","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.isArea && this.selectedAreaList.length == 0){
      this.toastr.warning("please select a Block","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.isName && this.selectedNameList.length == 0){
      this.toastr.warning("please select a Gram Panchayat","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.isAddress && this.selectedAddressList.length == 0){
      this.toastr.warning("please select a Village","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.selectedRoleList.length == 0){
      this.toastr.warning("please select a role","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.selectedEmployeeList.length == 0){
      this.toastr.warning("please select a employee","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    let jsonData = {
      state : CommonFunction.createCommaSeprate(this.selectedStateList),
      city : CommonFunction.createCommaSeprate(this.selectedCityList),
      area : CommonFunction.createCommaSeprate(this.selectedAreaList),
      name : CommonFunction.createCommaSeprate(this.selectedNameList),
      address : CommonFunction.createCommaSeprate(this.selectedAddressList),
      role : CommonFunction.createCommaSeprateByParamDesc(this.selectedRoleList),
      employee : CommonFunction.createCommaSeprate(this.selectedEmployeeList),
      actionType : actionType,
      tenentId : this.tenentId
    }
    
    this.layoutComponent.ShowLoading = true;
    this.sharedService.submitDataByInsertType(jsonData, 'employeeLocationMapping')
    .subscribe((response) =>{
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        // this.getStateCityAreaList("state",0);
        this.setDefaultToField();
        this.getEmpLocMappingList();
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("submit location data"),"Alert !",{timeOut : this.alertFadeoutTime});
      this.layoutComponent.ShowLoading = false;
    });
  }

  

  arrayBuffer:any;
  importData = [];
  addfile(event)     
  {    
    let file= event.target.files[0];     
    let fileReader = new FileReader();    
    fileReader.readAsArrayBuffer(file);     
    fileReader.onload = (e) => {    
        this.arrayBuffer = fileReader.result;    
        var data = new Uint8Array(this.arrayBuffer);    
        var arr = new Array();    
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
        var bstr = arr.join("");    
        var workbook = XLSX.read(bstr, {type:"binary"});    
        var first_sheet_name = workbook.SheetNames[0];    
        var worksheet = workbook.Sheets[first_sheet_name];
        this.importData = XLSX.utils.sheet_to_json(worksheet,{raw:true});
        // console.log(imprtData);
        // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));    
        //   var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});     
        //       this.filelist = [];    
        //       console.log(this.filelist)    
      
    }    
  } 

  uploadLocationData(){
    if(this.importData.length == 0){
      this.toastr.warning("please select file first ","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    this.layoutComponent.ShowLoading = true;
    let uploadLocationList = [];
    for(let i=0;i<this.importData.length;i++){
      let json = {
        srNo : this.importData[i].SrNo,
        state : this.importData[i].Division,
        city : this.importData[i].District,
        area : this.importData[i].Block,
        name : this.importData[i].GramPanchayat,
        address : this.importData[i].Village,
        tenentId : this.tenentId
      }
      uploadLocationList.push(json);
    }
   
    this.sharedService.submitDataByInsertType(uploadLocationList, 'importLocation')
    .subscribe((response) =>{
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        this.setDefaultToField();
        this.getAllLocationList();
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("submit location data"),"Alert !",{timeOut : this.alertFadeoutTime});
      this.layoutComponent.ShowLoading = false;
    });
  }

  downloadFormat(){
    let link = "http://www.trinityapplab.in/UNOPS/files/uploadFormat/Location_Upload.xlsx";
    window.open(link);
  }

  setDefaultToField(){
    this.state = ""
    this.city = "";
    this.area = "";
    this.name = "";
    this.address = "";
    this.editState = ""
    this.editCity = "";
    this.editArea = "";
    this.editName = "";
    this.editAddress = "";
    this.importData = [];
    $("#locationFile").val("");
    this.selectedStateList = [];
    this.selectedCityList = [];
    this.selectedAreaList = [];
    this.selectedNameList = [];
    this.selectedAddressList = [];
    this.selectedRoleList = [];
    this.employeeList = [];
    this.selectedEmployeeList = [];
    this.isState = false;
    this.isCity = false;
    this.isArea = false;
    this.isName = false;
    this.isAddress = false;
    $('input:radio[name=loc]').each(function () { $(this).prop('checked', false); });
  }

  onCustomAction(event) {
    switch ( event.action) {
      case 'editrecord':
        this.editLocation(event);
      break;
    }
    
  }
  updateEmpLocMappingData(){
    this.submitEmpLocMappingData("update");
    this.isNew = true;
  }
  cancelEmpLocMappingData(){
    this.isNew = true;
    this.setDefaultToField();
  }

  closeEditModal(){
    if(!this.isDoAnyChange){
      let isConfirm = confirm("Do you want to close?");
      if(isConfirm){
        $("#editLocationModal").modal("hide");
      }
    }
    else{
      $("#editLocationModal").modal("hide");
    }
  }

  isDoAnyChange : boolean = true;
  editLocationId = "";
  editState = "";
  editCity = "";
  editArea = "";
  editName = "";
  editAddress = "";
  editLocation(event){
    this.isDoAnyChange = true;
    this.editLocationId = event.data.locId;
    this.editState = event.data.state;
    this.editCity = event.data.city;
    this.editArea = event.data.area;
    this.editName = event.data.name;
    this.editAddress = event.data.address;
    
    $("#editLocationModal").modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  editLocationData(){
    if(this.editState == ""){
      this.toastr.warning("please enter Division ","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editCity == ""){
      this.toastr.warning("please enter District ","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editArea == ""){
      this.toastr.warning("please enter Block ","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editName == ""){
      this.toastr.warning("please enter Gram panchayat","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editAddress == ""){
      this.toastr.warning("please enter Village","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    
    let jsonData = {
      locId : this.editLocationId,
      state : this.editState,
      city : this.editCity,
      area : this.editArea,
      name : this.editName,
      address : this.editAddress,
      tenentId : this.tenentId
    }
    
    this.layoutComponent.ShowLoading = true;
    this.sharedService.updateDataByUpdateType(jsonData,'updateLocation')
    .subscribe((response) =>{
      //console.log(response);
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        $("#editLocationModal").modal("hide");
        this.setDefaultToField();
        this.getAllLocationList();
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("submit location data"),"Alert !",{timeOut : this.alertFadeoutTime});
      this.layoutComponent.ShowLoading = false;
    });
  }

  getCurrentChecked(type : any){
    this.isState = false;
    this.isCity = false;
    this.isArea = false;
    this.isName = false;
    this.isAddress = false;

    this.selectedStateList = [];
    this.selectedCityList = [];
    this.selectedAreaList = [];
    this.selectedNameList = [];
    this.selectedAddressList = [];

    if(type == 1) this.isState = true;
    else if(type == 2) this.isCity = true;
    else if(type == 3) this.isArea = true;
    else if(type == 4) this.isName = true;
    else if(type == 5) this.isAddress = true;
  }
  openAnyModal(modalId){
    if(modalId == 'createEmpLocModal' && this.isNew) this.getAllList();
    $("#"+modalId).modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  closeAnyModal(modalName){
    $("#"+modalName).modal("hide");
    this.cancelEmpLocMappingData();
  }


}
