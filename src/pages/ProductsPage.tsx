
import React from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  TrendingUp, 
  AlertCircle, 
  Filter,
  Plus 
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/data-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomProgress } from '@/components/ui/custom-progress';

const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Mock product data
  const productData = [
    { id: 1, name: 'Product A', category: 'Category 1', sales: 145000, units: 1250, target: 140000, growth: 12.5, inventory: 580, margin: 32 },
    { id: 2, name: 'Product B', category: 'Category 1', sales: 98000, units: 820, target: 110000, growth: -4.2, inventory: 340, margin: 28 },
    { id: 3, name: 'Product C', category: 'Category 2', sales: 210000, units: 1850, target: 200000, growth: 8.7, inventory: 720, margin: 35 },
    { id: 4, name: 'Product D', category: 'Category 2', sales: 76000, units: 640, target: 80000, growth: 5.3, inventory: 280, margin: 26 },
    { id: 5, name: 'Product E', category: 'Category 3', sales: 182000, units: 1540, target: 175000, growth: 15.2, inventory: 490, margin: 38 },
    { id: 6, name: 'Product F', category: 'Category 3', sales: 65000, units: 520, target: 70000, growth: -2.1, inventory: 210, margin: 24 },
  ];
  
  // Mock category data for pie chart
  const categoryData = [
    { name: 'Category 1', value: 243000 },
    { name: 'Category 2', value: 286000 },
    { name: 'Category 3', value: 247000 },
  ];
  
  // Colors for charts
  const COLORS = ['#0F52BA', '#4CAF50', '#FFC107', '#FF6B6B', '#9C27B0', '#00BCD4'];
  
  // Calculate performance percentages
  const productPerformance = productData.map(product => ({
    name: product.name,
    performance: (product.sales / product.target) * 100
  }));

  return (
    <>
      <Header 
        title="Product Management" 
        subtitle={`Product portfolio for ${user?.territory || 'All Territories'}`}
        showExport
      />
      
      <main className="dashboard-layout">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <ShoppingBag size={18} className="mr-2 text-sales-primary" />
                Product Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productData.length}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Active Products
                </div>
                <div className="text-sm flex items-center text-sales-success">
                  <TrendingUp size={14} className="mr-1" />
                  <span>+2 this quarter</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <ShoppingBag size={18} className="mr-2 text-sales-primary" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(productData.reduce((sum, product) => sum + product.sales, 0))}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  vs Target: {formatCurrency(productData.reduce((sum, product) => sum + product.target, 0))}
                </div>
                <div className="text-sm flex items-center text-sales-success">
                  <TrendingUp size={14} className="mr-1" />
                  <span>+8.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <ShoppingBag size={18} className="mr-2 text-sales-primary" />
                Units Sold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(productData.reduce((sum, product) => sum + product.units, 0))}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Total Inventory: {formatNumber(productData.reduce((sum, product) => sum + product.inventory, 0))}
                </div>
                <div className="text-sm flex items-center text-sales-success">
                  <TrendingUp size={14} className="mr-1" />
                  <span>+6.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Product Tabs */}
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Sales Chart */}
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">Product Sales</CardTitle>
                  <CardDescription>Sales by product comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={productData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Bar dataKey="sales" name="Sales" fill="#0F52BA" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="target" name="Target" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Category Distribution */}
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">Category Distribution</CardTitle>
                  <CardDescription>Sales by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Product Performance</CardTitle>
                    <CardDescription>Sales performance against targets</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter size={14} />
                    <span>Filter</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {productData.map((product) => (
                    <div key={product.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(product.sales)}</p>
                          <p className={`text-sm ${product.growth >= 0 ? 'text-sales-success' : 'text-sales-danger'}`}>
                            {product.growth >= 0 ? '+' : ''}{product.growth}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress to target</span>
                        <span>{formatPercentage(product.sales / product.target * 100)}</span>
                      </div>
                      
                      <CustomProgress 
                        value={(product.sales / product.target) * 100} 
                        className="h-2" 
                        indicatorClassName={
                          (product.sales / product.target) * 100 >= 100 ? "bg-sales-success" :
                          (product.sales / product.target) * 100 >= 85 ? "bg-sales-warning" :
                          "bg-sales-danger"
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Inventory Status</CardTitle>
                    <CardDescription>Current stock levels</CardDescription>
                  </div>
                  <Button size="sm" className="flex items-center gap-2">
                    <Plus size={14} />
                    <span>Restock</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium py-3">Product</th>
                        <th className="text-left font-medium py-3">Category</th>
                        <th className="text-right font-medium py-3">In Stock</th>
                        <th className="text-right font-medium py-3">Reorder At</th>
                        <th className="text-right font-medium py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.map((product) => {
                        const reorderPoint = Math.floor(product.units * 0.2);
                        const status = product.inventory > reorderPoint * 2 
                          ? "Good" 
                          : product.inventory > reorderPoint 
                          ? "Medium" 
                          : "Low";
                        
                        return (
                          <tr key={product.id} className="border-b">
                            <td className="py-3">{product.name}</td>
                            <td className="py-3">{product.category}</td>
                            <td className="text-right py-3">{product.inventory}</td>
                            <td className="text-right py-3">{reorderPoint}</td>
                            <td className="text-right py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                status === "Good" ? "bg-sales-success/20 text-sales-success" :
                                status === "Medium" ? "bg-sales-warning/20 text-sales-warning" :
                                "bg-sales-danger/20 text-sales-danger"
                              }`}>
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* AI Insights */}
        <Card className="border-l-4 border-l-sales-primary">
          <CardContent className="p-6">
            <div className="flex items-start">
              <AlertCircle className="text-sales-primary mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Product Insights</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Products C and E are the top performers this quarter, exceeding targets by 5% and 4% respectively.</p>
                  <p>Consider redistributing inventory from Product B to support the growing demand for Product A.</p>
                  <p>Category 2 shows the strongest growth trajectory and should be prioritized for marketing campaigns.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default ProductsPage;
