$(document).ready(function () {
    VoucherReceipt.InitalizeComponent();
});
var VoucherReceipt;
(function (VoucherReceipt) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession();
    var btnAdd;
    var db_Type;
    var Model = new Voucher_Receipt();
    function InitalizeComponent() {
        InitalizeControls();
        InitializeEvents();
        Close_Loder();
        $('#Txt_TrData').val(GetDate());
    }
    VoucherReceipt.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnAdd = document.getElementById("btnAdd");
        db_Type = document.getElementById("db_Type");
    }
    function InitializeEvents() {
        btnAdd.onclick = Add_Reciept;
        db_Type.onchange = db_Type_Change;
    }
    //****************************************************** Validtion and Clear *****************************************
    function db_Type_Change() {
        if (db_Type.value == "0") {
            $('#Trans').removeClass("display_none");
        }
        else {
            $('#Trans').addClass("display_none");
            $('#Txt_TransNO').val("");
        }
    }
    function Add_Reciept() {
        if (db_Type.value == "1" && $('#Txt_TransNO').val().trim() == "") {
            Errorinput($('#Txt_TransNO'), "Please Enter Transfer No 🤨");
            return;
        }
        if (Number($('#Txt_Amount').val()) == 0) {
            Errorinput($('#Txt_Amount'), "Please Enter Amount 🤨");
            return;
        }
        if ($('#Txt_nameRecipient').val().trim() == "") {
            Errorinput($('#Txt_nameRecipient'), "Please Enter Name of Recipient 🤨");
            return;
        }
        Model = new Voucher_Receipt();
        Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
        Model.BraCode = Number(SysSession.CurrentEnvironment.BranchCode);
        Model.TrType = 0;
        Model.RefNO = $('#Txt_Ref_No').val();
        Model.TrDate = DateFormat($('#Txt_TrData').val());
        Model.NameRecipient = $('#Txt_nameRecipient').val();
        Model.IsCash = db_Type.value == "1" ? true : false;
        Model.Amount = Number($('#Txt_Amount').val());
        Model.TransferNo = $('#Txt_TransNO').val();
        Model.Status = false;
        Model.Remark = $('#Txt_Remarks').val();
        Model.CreatedAt = DateFormat(GetDateAndTime());
        Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
        Ajax.CallsyncSave({
            type: "Post",
            url: sys.apiUrl("SalesMan", "InsertVoucher"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    $('#Div_Header :Input').val('');
                    Close_Loder();
                }
                else {
                }
            }
        });
    }
})(VoucherReceipt || (VoucherReceipt = {}));
//# sourceMappingURL=VoucherReceipt.js.map