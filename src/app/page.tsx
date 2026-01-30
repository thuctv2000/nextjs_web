import { MainLayout } from "@/presentation/components/layouts";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/common";

export default function Home() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <section className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to NextJS Website
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern web application built with Next.js and Clean Architecture
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Domain Layer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Contains business entities, value objects, and repository interfaces.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Layer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Contains use cases, DTOs, and application-specific business rules.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Layer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Contains repository implementations, API clients, and external services.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="text-center py-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Get Started
          </h2>
          <div className="flex justify-center gap-4">
            <Button variant="primary">Learn More</Button>
            <Button variant="outline">Documentation</Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
