﻿using System.Collections.Generic;
using Inv.DAL.Domain;

namespace Inv.API.Models.CustomModel
{
    public class AQ_ServPurInvoiceMasterDetail : SecurityandUpdateFlagClass
    {

        public List<AVAT_TR_PurInvoice> AVAT_TR_PurInvoice { get; set; }
        public List<AQVAT_GetPurInvoiceHeader> AQVAT_GetPurInvoiceHeader { get; set; }
        public List<AQVAT_GetPurInvoiceDetail> AQVAT_GetPurInvoiceDetail { get; set; }

    }
}