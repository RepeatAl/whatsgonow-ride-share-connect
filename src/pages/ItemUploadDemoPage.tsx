
import React from "react";
import Layout from "@/components/Layout";
import ItemUploadDemo from "@/components/order/ItemUploadDemo";

const ItemUploadDemoPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <ItemUploadDemo />
      </div>
    </Layout>
  );
};

export default ItemUploadDemoPage;
