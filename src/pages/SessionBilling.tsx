
  const uploadInvoiceFiles = async (sessionId: string) => {
    console.log('Uploading invoice files for session:', sessionId, invoiceFiles);
    return { 
      files: invoiceFiles.map(file => file.name)
    };
  };
  
  const uploadReceiptFiles = async (sessionId: string) => {
    console.log('Uploading receipt files for session:', sessionId, receiptFiles);
    return {
      files: receiptFiles.map(file => file.name)
    };
  };
