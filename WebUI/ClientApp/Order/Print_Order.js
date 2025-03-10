$(document).ready(function () {
    Print_Order.InitalizeComponent();
});
var Print_Order;
(function (Print_Order) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession();
    var _USER = new Array();
    var _Invoices = new Array();
    var _InvoiceItems = new Array();
    var _Inv = new Vnd_Inv_SlsMan();
    var _InvItems = new Array();
    var _IQ_ItemCollect = new Array();
    var _Print_Invoice;
    var ItemTotal = 0;
    var ItemCount = 0;
    var InvoiceID = 0;
    var InvoiceNote = 0;
    function InitalizeComponent() {
        debugger;
        var _USERS = GetGlopelDataUser();
        _USER = _USERS.filter(function (x) { return x.USER_CODE.toLowerCase() == SysSession.CurrentEnvironment.UserCode.toLowerCase(); });
        InitalizeControls();
        InitializeEvents();
        _Invoices = GetGlopelDataInvoice();
        _InvoiceItems = GetGlopelDataInvoiceItems();
        _IQ_ItemCollect = GetGlopelDataIQ_ItemCollect();
        InvoiceID = Number(localStorage.getItem("InvoiceID"));
        InvoiceNote = Number(localStorage.getItem("InvoiceNote"));
        _Inv = _Invoices.filter(function (x) { return x.InvoiceID == InvoiceID; })[0];
        if (InvoiceNote == 1) {
            _InvItems = _InvoiceItems.filter(function (x) { return x.InvoiceID == InvoiceID; });
        }
        else {
            _InvItems = _IQ_ItemCollect.filter(function (x) { return x.InvoiceID == InvoiceID; });
        }
        $(".User" + _USER[0].USER_TYPE).removeClass('display_none');
        Display_Inv();
        Close_Loder();
    }
    Print_Order.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        _Print_Invoice = document.getElementById("_Print_Invoice");
    }
    function InitializeEvents() {
        _Print_Invoice.onclick = _Print_Invoice_onclick;
    }
    function Display_Inv() {
        Create_Invoice_Print();
        TotalComplet();
        if (InvoiceNote == 1) {
            $('.Type_Invoice').addClass('display_none');
            $('.Type_Note').removeClass('display_none');
        }
    }
    function Create_Invoice_Print() {
        $('#Print_Name_Cust').html("<strong>Name:</strong> " + _Inv.CustomerName);
        $('#Print_Name_Phone').html("<strong>Phone:</strong> " + _Inv.CustomerMobile1);
        $('#Print_Name_Address').html("<strong>Address:</strong> " + _Inv.Address);
        $('#Tran_ID_Print').html("<strong>Transaction ID:</strong> " + _Inv.InvoiceID + " <br/><strong>        RefNO :</strong> " + _Inv.RefNO);
        $('#Tran_Date_Print').html("<strong>Date:</strong> " + DateFormat(_Inv.DeliveryDate));
        $('#Body_Inv_Print').html('');
        ItemTotal = 0;
        ItemCount = 0;
        for (var i = 0; i < _InvItems.length; i++) {
            if ($('#StatusFlag' + i).val() != 'd' && $('#StatusFlag' + i).val() != 'm') {
                var Row = "<tr>\n                           <td class=\"Type_Note display_none\">" + _InvItems[i].ItemCode + " </td>\n                           <td>" + _InvItems[i].ItemDescA + " </td>\n                           <td Class=\"Type_Invoice\">" + _InvItems[i].SoldQty + "</td>\n                           <td Class=\"Type_Invoice\">" + _InvItems[i].Unitprice + "</td>\n                           <td Class=\"Type_Invoice\">" + (_InvItems[i].SoldQty * _InvItems[i].Unitprice).toFixed(2) + "</td>\n                        </tr>";
                ItemTotal = ItemTotal + _InvItems[i].ItemTotal;
                ItemCount = ItemCount + _InvItems[i].SoldQty;
                $('#Body_Inv_Print').append(Row);
            }
        }
        $('#Txt_TotalAmount').val(ItemTotal.toFixed(2));
        $('#Txt_NetAmount').val(ItemTotal.toFixed(2));
        $('#Total_inv_Print').html(ItemTotal.toFixed(2));
    }
    function TotalComplet() {
        $('#Txt_PrcVatAmount').val(_Inv.VatType);
        $('#Txt_VatAmount').val(_Inv.VatAmount);
        $('#Txt_TotalAmount').val(_Inv.TotalAmount);
        $('#Txt_CommitionAmount').val(_Inv.CommitionAmount);
        $('#Txt_NetAmount').val(_Inv.NetAfterVat);
        var PrcVat = Number($('#Txt_PrcVatAmount').val());
        var TotalAmount = Number($('#Txt_TotalAmount').val());
        var VatAmount = ((PrcVat * TotalAmount) / 100);
        $('#Txt_VatAmount').val(VatAmount);
        var CommitionAmount = Number($('#Txt_CommitionAmount').val());
        $('#Txt_NetAmount').val((VatAmount + TotalAmount + CommitionAmount).toFixed(2));
    }
    function _Print_Invoice_onclick() {
        printDiv('Body_Print_Inv');
    }
})(Print_Order || (Print_Order = {}));
//# sourceMappingURL=Print_Order.js.map