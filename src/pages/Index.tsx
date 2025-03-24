import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Printer } from "lucide-react";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import { QRCodeSVG } from "qrcode.react";

const Index = () => {
  const [placeId, setPlaceId] = useState("");
  const [businessName, setBusinessName] = useState("");
  
  const generateReviewLink = () => {
    return `https://search.google.com/local/writereview?placeid=${placeId}`;
  };

  const copyToClipboard = async () => {
    if (!placeId) {
      toast.error("Please search and select your business first");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(generateReviewLink());
      toast.success("Review link copied to clipboard!");
      console.log("Link copied:", generateReviewLink());
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };

  const handlePlaceSelected = (newPlaceId: string, newBusinessName: string) => {
    console.log('Setting new place ID:', newPlaceId);
    setPlaceId(newPlaceId);
    setBusinessName(newBusinessName);
  };

  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
              .qr-container { text-align: center; }
              @media print {
                body { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div>${businessName}</div>
              ${document.getElementById('qr-code')?.innerHTML || ''}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-2xl mx-auto pt-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Google Review Link Generator
          </h1>
          <p className="text-lg text-gray-600">
            Easily generate links for Google reviews or posts for your business
          </p>
          <p className="text-lg text-gray-600">
            Made with ❤️ by <a href="https://postners.com" className="text-blue-500">Postners</a> in Canada
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="placeSearch" className="block text-sm font-medium text-gray-700 mb-2">
                Search For Your Business
              </label>
              <div className="beam-border rounded-md overflow-hidden">
                <PlacesAutocomplete
                  onPlaceSelected={handlePlaceSelected}
                  value={businessName}
                />
              </div>
            </div>

            {placeId && (
              <>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-700 mb-2">Generated Review Link:</p>
                  <div className="flex items-center gap-2 break-all">
                    <code className="text-sm bg-white p-2 rounded flex-1">
                      {generateReviewLink()}
                    </code>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-medium text-gray-700">QR Code:</p>
                    <Button
                      onClick={printQRCode}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Print QR Code
                    </Button>
                  </div>
                  <div className="flex justify-center" id="qr-code">
                    <QRCodeSVG
                      value={generateReviewLink()}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Instructions:</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Search for your business in the search box above</li>
                <li>Select your business from the dropdown</li>
                <li>Copy and share the generated review link</li>
                <li>Or print the QR code to display in your business</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
