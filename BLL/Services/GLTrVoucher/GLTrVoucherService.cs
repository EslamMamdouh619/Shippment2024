﻿using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Inv.BLL.Services.GLTrVoucher
{
    public class GLTrVoucherService : IGLTrVoucherService
    {
        private readonly IUnitOfWork unitOfWork;

        public GLTrVoucherService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        #region IGLTrVoucher Services

        public A_ACCOUNT GetById(int id)
        {
            return unitOfWork.Repository<A_ACCOUNT>().GetById(id);
        }

        public List<A_ACCOUNT> GetAll()
        {
            return unitOfWork.Repository<A_ACCOUNT>().GetAll();
        }

        public List<A_ACCOUNT> GetAll(Expression<Func<A_ACCOUNT, bool>> predicate)
        {
            return unitOfWork.Repository<A_ACCOUNT>().Get(predicate);
        }

        public A_ACCOUNT Insert(A_ACCOUNT entity)
        {
            var memb = unitOfWork.Repository<A_ACCOUNT>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public A_ACCOUNT Update(A_ACCOUNT entity)
        {

            var memb = unitOfWork.Repository<A_ACCOUNT>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<A_ACCOUNT>().Delete(id);
            unitOfWork.Save();
        }
        #endregion
    }
}
