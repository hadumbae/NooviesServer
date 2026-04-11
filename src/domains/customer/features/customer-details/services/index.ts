import {
    fetchCustomerProfileViewData, fetchCustomerReviewsViewData,
    fetchCustomerReviewViewData
} from "@domains/customer/features/customer-details/services/service";
import type {
    CustomerProfileViewData,
    CustomerReviewViewData,
    FetchCustomerProfileViewDataConfig, FetchCustomerReviewLogsViewData, FetchCustomerReviewLogsViewDataConfig,
    FetchCustomerReviewsViewData,
    FetchCustomerReviewsViewDataConfig,
    FetchCustomerReviewViewDataConfig
} from "@domains/customer/features/customer-details/services/service.types";

export {
    fetchCustomerProfileViewData,
    fetchCustomerReviewViewData,
    fetchCustomerReviewsViewData,
}
export type {
    FetchCustomerProfileViewDataConfig,
    CustomerProfileViewData,
    FetchCustomerReviewViewDataConfig,
    CustomerReviewViewData,
    FetchCustomerReviewsViewDataConfig,
    FetchCustomerReviewsViewData,
    FetchCustomerReviewLogsViewDataConfig,
    FetchCustomerReviewLogsViewData,
}

