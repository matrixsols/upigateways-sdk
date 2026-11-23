from setuptools import setup, find_packages

setup(
    name="upigateways",
    version="1.0.0",
    description="Official Python SDK for UPI Gateways - Zero Transaction Fee (0% MDR) UPI Payment Infrastructure with instant bank settlement.",
    long_description=open("README.md", encoding="utf-8").read(),
    long_description_content_type="text/markdown",
    author="UPI Gateways",
    author_email="support@upigateways.in",
    url="https://www.upigateways.in",
    project_urls={
        "Documentation": "https://www.upigateways.in/docs",
        "Repository": "https://github.com/ammireddy1998/matrixpay",
    },
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Programming Language :: Python :: 3.13",
        "Topic :: Office/Business :: Financial :: Point-Of-Sale",
    ],
    python_requires=">=3.8",
    keywords="upi payment-gateway india 0-mdr razorpay-alternative cashfree-alternative paytm phonepe gpay bhim matrixpay upigateways",
)
