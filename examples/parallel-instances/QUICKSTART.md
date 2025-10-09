# ⚡ **Quick Start Guide**

Get up and running with **modern Cypress 13.x+ parallel testing** using Sorry Cypress in just **5 minutes**!

> **🎉 This guide uses the breakthrough `cypress-cloud` integration that solved modern Cypress compatibility issues**

---

## 🚀 **Step 1: Start Sorry Cypress** (2 minutes)

From the **Sorry Cypress repository root**:

```bash
# Navigate to the project
cd sorry-cypress/examples/parallel-instances

# Start version-pinned stable deployment (recommended)
docker-compose -f docker-compose.v260.yml up -d

# Alternative: Local development with MinIO
# docker-compose -f docker-compose.local.yml up -d
```

**Wait 30 seconds**, then verify services are running:

```bash
docker-compose -f docker-compose.v260.yml ps
```

✅ **You should see**:
- `director` running on port **1234**
- `api` running on port **4000**  
- `dashboard` running on port **8080**
- `mongo` running on port **27017**

**🌐 Open Dashboard**: http://localhost:8080 *(bookmark this!)*

---

## 🎯 **Step 2: Install Dependencies** (1 minute)

Navigate to the Cypress example project:

```bash
cd cypress-example
npm install
```

✅ **This installs**:
- **Cypress 13.17.0** - Latest modern Cypress
- **cypress-cloud 1.9.0** - Breakthrough integration package
- All necessary dependencies

---

## 🔧 **Step 3: Configure Your Instances** (1 minute)

Edit `../instances.json` with your target URLs:

```bash
# Quick edit (or use your favorite editor)
nano ../instances.json
```

**Example configuration**:
```json
{
  "instances": [
    {
      "name": "github",
      "url": "https://github.com",
      "enabled": true,
      "description": "GitHub homepage"
    },
    {
      "name": "cypress-io", 
      "url": "https://www.cypress.io",
      "enabled": true,
      "description": "Cypress official site"
    },
    {
      "name": "example-org",
      "url": "https://example.org",
      "enabled": true,
      "description": "Example.org test site"
    },
    {
      "name": "scale-computing",
      "url": "https://10.100.24.31:443",
      "enabled": false,
      "description": "Scale Computing node (update for your environment)"
    }
  ]
}
```

**💡 Pro tip**: Start with public sites for your first test, then add your own URLs!

---

## 🧪 **Step 4: Run Your First Test** (<1 minute)

### **Option A: Single Instance Test**
```bash
# Test against example.org
CYPRESS_BASE_URL=https://example.org npx cypress-cloud \
  --spec "cypress/e2e/homepage.cy.js" \
  --parallel --record \
  --ci-build-id "quickstart-$(date +%s)" \
  --tag "getting-started"
```

### **Option B: Multiple Parallel Instances** 
```bash
# Navigate back to main directory
cd ..

# Run all enabled instances automatically
./run-parallel.sh
```

**🎯 That's it!** Your tests are now running in parallel with modern Cypress 13.x+!

---

## 📊 **Step 5: View Your Results** (Instant)

**🌐 Open**: http://localhost:8080

**What you'll see**:
- ✅ **Your Project**: Look for "scaleUI" or your configured project ID
- ✅ **Test Runs**: Click on build IDs to see detailed results  
- ✅ **Screenshots**: Visual evidence of test execution
- ✅ **Performance Data**: Load times and execution metrics
- ✅ **Instance Tags**: Filter results by instance name

**🎉 Success!** You now have modern Cypress running with Sorry Cypress dashboard!

---

## 🎯 **What Just Happened?**

1. **🐳 Sorry Cypress Stack**: Director, API, Dashboard, and MongoDB running in Docker
2. **⚡ Modern Integration**: cypress-cloud bypassed all record key validation issues  
3. **🚀 Parallel Execution**: Tests distributed automatically across your instances
4. **📊 Centralized Results**: All results aggregated in self-hosted dashboard
5. **🔮 Future-Proof**: Using latest Cypress 13.x+ with full feature support

---

## 🚀 **Next Steps**

### **Immediate Actions**:
- ✅ **Bookmark Dashboard**: http://localhost:8080
- ✅ **Update instances.json** with your real URLs
- ✅ **Try different test specs**: `cypress/e2e/navigation.cy.js`, `cypress/e2e/performance.cy.js`

### **Explore More**:
- 📖 **[Full Documentation](./README.md)** - Comprehensive setup and configuration
- 🧠 **[Memory Bank](./MEMORY_BANK.md)** - Technical implementation details  
- 🏗️ **[Project Overview](./INDEX.md)** - Architecture and features

### **Advanced Usage**:
```bash
# Full coverage mode (each instance runs complete suite)
MODE=full ./run-parallel.sh

# Custom build ID for tracking
BUILD_ID=release-v1.2.3 ./run-parallel.sh

# Specific instances only
./run-parallel.sh github cypress-io
```

---

## 🛠️ **Quick Troubleshooting**

### **❌ Tests not appearing in dashboard?**
```bash
# Check services are running
docker-compose -f docker-compose.v260.yml ps

# Verify Director is accessible  
curl http://localhost:1234

# Check cypress-cloud configuration
cat currents.config.js
```

### **❌ Connection issues?**
```bash
# Test instance URLs
curl -I https://your-instance-url.com

# Validate instances.json format
jq . ../instances.json
```

### **❌ Performance slow?**
```bash
# Monitor resources
docker stats

# Disable some instances temporarily  
# Edit instances.json and set "enabled": false
```

---

## 🎉 **Congratulations!**

You've successfully set up **modern Cypress 13.x+ parallel testing** with Sorry Cypress! 

**🌟 Key Achievement**: You're now using the breakthrough integration that solved the long-standing modern Cypress compatibility challenge.

### **What Makes This Special**:
- ✅ **No record key validation issues** (completely bypassed)
- ✅ **No Gateway Connector complexity** (direct integration)  
- ✅ **Latest Cypress features** (13.17.0 working perfectly)
- ✅ **Production ready** (verified with real test execution)

**Ready to scale your testing?** Check out the **[comprehensive documentation](./README.md)** for advanced features, CI/CD integration, and production deployment strategies!

---

**🚀 Happy Parallel Testing!** 

*You're now part of the modern Cypress testing revolution!*
