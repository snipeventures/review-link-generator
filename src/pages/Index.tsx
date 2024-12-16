import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy } from "lucide-react";

const Index = () => {
  const [placeId, setPlaceId] = useState("");
  
  const generateReviewLink = () => {
    return `https://search.google.com/local/writereview?place_id=${placeId}`;
  };

  const copyToClipboard = async () => {
    if (!placeId) {
      toast.error("Please enter a Place ID first");
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-2xl mx-auto pt-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Google Review Link Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate a direct link for customers to leave a Google review for your business
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="placeId" className="block text-sm font-medium text-gray-700 mb-2">
                Google Place ID
              </label>
              <Input
                id="placeId"
                type="text"
                placeholder="Enter your Google Place ID"
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                className="w-full"
              />
              <p className="mt-2 text-sm text-gray-500">
                Don't know your Place ID?{" "}
                <a
                  href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Find it here
                </a>
              </p>
            </div>

            {placeId && (
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
            )}

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">How to use:</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Find your Google Place ID using the link above</li>
                <li>Enter the Place ID in the input field</li>
                <li>Copy the generated review link</li>
                <li>Share the link with your customers</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;