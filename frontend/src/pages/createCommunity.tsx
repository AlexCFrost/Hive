import { apiEndpoint } from "@/lib/api-config";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast, { Toaster } from 'react-hot-toast';

const CreateCommunity = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation
    if (!name.trim()) {
      toast.error("Community name is required");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiEndpoint('/bee/community'), {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create community");
      }

      // Show success toast
      toast.success("Community created successfully!");

      // Redirect to communities page
      setTimeout(() => navigate('/community'), 1500);
    } catch (error) {
      // Handle error
      const errorMessage = error instanceof Error ? error.message : 'Failed to create community';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 text-white text-center">Create a New Community</h1>
      
      <div className="flex justify-center w-full px-4 md:px-0">
        <Card className="w-full max-w-md border border-gray-800 bg-black">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-xl text-white text-center">Community Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">
                  Community Name
                </label>
                <Input 
                  id="name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter community name"
                  required
                  className="w-full bg-gray-900 border-gray-700 text-white"
                />
              </div>

              <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-white">
                  Community Description
                </label>
                <Textarea 
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your community (optional)"
                  rows={4}
                  className="w-full bg-gray-900 border-gray-700 text-white"
                />
              </div>

              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 w-full text-white"
              >
                Create Community
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCommunity;