$(document).ready(function () {
    View_Order.InitalizeComponent();
});
var View_Order;
(function (View_Order) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession();
    var _USER = new Array();
    var _Inv = new Vnd_Inv_SlsMan();
    var _Invoices = new Array();
    var _InvoiceItems = new Array();
    var btn_Delete;
    var btn_freeze;
    var btn_Edit_Order;
    var btn_Confirm;
    var btn_Open_Location;
    var btn_Print;
    var btn_Delivery_Order;
    var btn_Deliver_shipment;
    var btn_Deliver_Customer;
    var btn_Receiving_Order;
    var btn_Active;
    var btn_Return;
    var btn_Return_All_Order;
    var InvoiceID = 0;
    function InitalizeComponent() {
        var _USERS = GetGlopelDataUser();
        _USER = _USERS.filter(function (x) { return x.USER_CODE.toLowerCase() == SysSession.CurrentEnvironment.UserCode.toLowerCase(); });
        InitalizeControls();
        InitializeEvents();
        _Invoices = GetGlopelDataInvoice();
        _InvoiceItems = GetGlopelDataInvoiceItems();
        InvoiceID = Number(localStorage.getItem("InvoiceID"));
        _Inv = _Invoices.filter(function (x) { return x.InvoiceID == InvoiceID; })[0];
        Display_information_Inv();
        Display_Role_User();
        Close_Loder();
        SetRefresh(GetModuleCode());
    }
    View_Order.InitalizeComponent = InitalizeComponent;
    function SetRefresh(moduleCode) {
        $(document).on('click', '.Refresh_' + moduleCode, function () {
            Dis_Refrsh();
            // Shows an alert when a dynamically created button is clicked
        });
    }
    function InitalizeControls() {
        btn_Delete = document.getElementById('btn_Delete');
        btn_freeze = document.getElementById('btn_freeze');
        btn_Edit_Order = document.getElementById('btn_Edit_Order');
        btn_Confirm = document.getElementById('btn_Confirm');
        btn_Open_Location = document.getElementById('btn_Open_Location');
        btn_Print = document.getElementById('btn_Print');
        btn_Delivery_Order = document.getElementById('btn_Delivery_Order');
        btn_Deliver_shipment = document.getElementById('btn_Deliver_shipment');
        btn_Deliver_Customer = document.getElementById('btn_Deliver_Customer');
        btn_Receiving_Order = document.getElementById('btn_Receiving_Order');
        btn_Active = document.getElementById('btn_Active');
        btn_Return = document.getElementById('btn_Return');
        btn_Return_All_Order = document.getElementById('btn_Return_All_Order');
    }
    function InitializeEvents() {
        btn_Delete.onclick = btn_Delete_onclick;
        btn_freeze.onclick = btn_freeze_onclick;
        btn_Edit_Order.onclick = btn_Edit_Order_onclick;
        btn_Confirm.onclick = btn_Confirm_onclick;
        btn_Open_Location.onclick = btn_Open_Location_onclick;
        btn_Print.onclick = btn_Print_onclick;
        btn_Delivery_Order.onclick = btn_Delivery_Order_onclick;
        btn_Deliver_shipment.onclick = btn_Deliver_shipment_onclick;
        btn_Deliver_Customer.onclick = btn_Deliver_Customer_onclick;
        btn_Receiving_Order.onclick = btn_Receiving_Order_onclick;
        btn_Active.onclick = btn_Active_onclick;
        btn_Return.onclick = btn_Return_onclick;
        btn_Return_All_Order.onclick = btn_Return_All_Order_onclick;
    }
    function Display_information_Inv() {
        $("._clearSta").removeClass("is-active");
        $("#View_Status" + _Inv.Status).addClass("is-active");
        $("#Name_Cust_View_Or").html("Name: " + _Inv.CustomerName);
        $("#Phone_View_Or").html("Phone: " + _Inv.CustomerMobile1 + " & " + _Inv.CustomerMobile2);
        $("#RefNo_TrNo_View_Or").html(" RefNo ( " + _Inv.RefNO + " ) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; TrNo ( " + _Inv.TrNo + " )");
        $("#Vat_Total_View_Or").html(" Vat ( " + _Inv.VatAmount + " ) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Total ( " + _Inv.TotalAmount + " ) ");
        $("#Comm_Total_View_Or").html(" Commition ( " + _Inv.CommitionAmount + " ) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Net Total ( " + _Inv.NetAfterVat + " ) ");
        $("#Coun_View").html("  &nbsp;&nbsp;&nbsp;    Counter Item ( " + _Inv.ItemCount + " ) ");
    }
    function Display_Role_User() {
        $(".USER" + _USER[0].USER_TYPE).removeClass('hidden_Control');
        $(".Status" + _Inv.Status).removeClass('display_none');
        if (_USER[0].USER_TYPE == 10) {
            if (_Inv.Status == 0) { //freeze
                $("#btn_Active").removeClass("display_none");
                $("#btn_freeze").addClass("display_none");
                $("#btn_Edit_Order").removeClass("display_none");
            }
            if (_Inv.Status == 1) { //Active
                $("#btn_Active").addClass("display_none");
                $("#btn_Edit_Order").addClass("display_none");
                $("#btn_freeze").removeClass("display_none");
            }
            if (_Inv.Status == 2) { //Confirm
                $("#btn_Active").addClass("display_none");
                $("#btn_freeze").removeClass("display_none");
                $("#btn_Edit_Order").addClass("display_none");
            }
        }
    }
    //******************************************************* Events Buttons ************************************
    function btn_Delete_onclick() {
        UpdateInvStatus(InvoiceID, 0, -1, 'Delete Invoice ( ' + _Inv.InvoiceID + ' )', function () {
            $('#Back_Page').click();
            $("#Display_Back_Page").click();
        });
    }
    function btn_freeze_onclick() {
        UpdateInvStatus(InvoiceID, 0, 0, 'Freeze Invoice ( ' + _Inv.InvoiceID + ' )', function () {
            $("#btn_Active").removeClass("display_none");
            $("#btn_Edit_Order").removeClass("display_none");
            $("#btn_freeze").addClass("display_none");
            $("#Display_Back_Page").click();
        });
    }
    function btn_Active_onclick() {
        UpdateInvStatus(InvoiceID, 0, 1, 'Active Invoice ( ' + _Inv.InvoiceID + ' )', function () {
            $("#btn_Active").addClass("display_none");
            $("#btn_Edit_Order").addClass("display_none");
            $("#btn_freeze").removeClass("display_none");
            $("#Display_Back_Page").click();
        });
    }
    function btn_Edit_Order_onclick() {
        localStorage.setItem("InvoiceID", InvoiceID.toString());
        OpenPagePartial("Edit_Order", "Edit Order", null, function () { Display_Refrsh(); });
    }
    function btn_Confirm_onclick() {
        if (Number(_Inv.CommitionAmount) <= 0) {
            Errorinput($('#btn_Edit_Order'), 'Please a Review Order 😒 ');
            return;
        }
        UpdateInvStatus(InvoiceID, 0, 2, 'Confirm Invoice ( ' + _Inv.InvoiceID + ' )', function () {
            $('#Back_Page').click();
            $("#Display_Back_Page").click();
        });
    }
    function btn_Receiving_Order_onclick() {
        localStorage.setItem("InvoiceID", InvoiceID.toString());
        OpenPagePartial("Coding_Items", "Coding Items", null, function () { Display_Refrsh(); });
    }
    function btn_Print_onclick() {
        localStorage.setItem("InvoiceID", InvoiceID.toString());
        localStorage.setItem("InvoiceNote", "0");
        OpenPagePartial("Print_Order", "Print Order 🧺");
    }
    function btn_Delivery_Order_onclick() {
        localStorage.setItem("InvoiceID", InvoiceID.toString());
        localStorage.setItem("InvoiceNote", "1");
        OpenPagePartial("Print_Order", "Print Order 🧺");
    }
    function btn_Deliver_shipment_onclick() {
        sys.FindKey("Deliver", "btnDeliver", " Isactive = 1 and ZoneID =" + _Inv.ZoneID, function () {
            debugger;
            var id = SearchGrid.SearchDataGrid.SelectedKey;
            UpdateInvStatus(InvoiceID, id, 4, 'Deliver Shipment ( ' + _Inv.InvoiceID + ' )', function () {
                $('#Back_Page').click();
                $("#Display_Back_Page").click();
            });
        });
    }
    function btn_Open_Location_onclick() {
    }
    function btn_Deliver_Customer_onclick() {
        UpdateInvStatus(InvoiceID, 0, 5, 'Deliver Customer ( ' + _Inv.InvoiceID + ' )', function () {
            $('#Back_Page').click();
            $("#Display_Back_Page").click();
        });
    }
    function btn_Return_onclick() {
        localStorage.setItem("InvoiceID", InvoiceID.toString());
        OpenPagePartial("Return_Items", "Return Items", null, function () { Display_Refrsh(); });
    }
    function btn_Return_All_Order_onclick() {
        var StatusDesc = 'Return All Order ( ' + _Inv.InvoiceID + ' )';
        Ajax.CallsyncSave({
            type: "Get",
            url: sys.apiUrl("SlsInvoice", "UpdateInvTrType"),
            data: { CompCode: Number(SysSession.CurrentEnvironment.CompCode), BranchCode: Number(SysSession.CurrentEnvironment.BranchCode), InvoiceID: InvoiceID, TrType: 1, UserCode: SysSession.CurrentEnvironment.UserCode, StatusDesc: StatusDesc },
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    ShowMessage('Done ✅');
                    $('#Back_Page').click();
                    $("#Display_Back_Page").click();
                    Close_Loder();
                }
                else {
                    Close_Loder();
                }
            }
        });
    }
    var Run_Fun = false;
    function Display_Refrsh() {
        if (!Run_Fun) {
            Run_Fun = true;
            return;
        }
        Dis_Refrsh();
    }
    function Dis_Refrsh() {
        debugger;
        $("#Display_Back_Page").click();
        _Inv = new Vnd_Inv_SlsMan();
        _Invoices = new Array();
        _Invoices = GetGlopelDataInvoice();
        _InvoiceItems = GetGlopelDataInvoiceItems();
        InvoiceID = Number(localStorage.getItem("InvoiceID"));
        _Inv = _Invoices.filter(function (x) { return x.InvoiceID == InvoiceID; })[0];
        if (_Inv == null) {
            debugger;
            $('#Back_Page').click();
            return;
        }
        debugger;
        Display_information_Inv();
    }
})(View_Order || (View_Order = {}));
//# sourceMappingURL=View_Order.js.map