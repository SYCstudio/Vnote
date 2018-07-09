# [POI2011]TEM-Temperature
[BZOJ2276 Luogu3522]

The Byteotian Institute of Meteorology (BIM) measures the air temperature daily.  
The measurement is done automatically, and its result immediately printed.  
Unfortunately, the ink in the printer has long dried out...  
The employees of BIM however realised the fact only recently, when the Byteotian Organisation for Meteorology (BOM) requested access to that data.  
An eager intern by the name of Byteasar saved the day, as he systematically noted down the temperatures reported by two domestic alcohol thermometers placed on the north and south outside wall of the BIM building.  
It was established decades ago by various BIM employees that the temperature reported by the thermometer on the south wall of the building is never lower than the actual temperature, while that reported by the thermometer on the north wall of the building is never higher than the actual temperature.  
Thus even though the exact temperatures for each day remain somewhat of a mystery, the range they were in is known at least.  
Fortunately for everyone involved (except Byteasar and you, perhaps), BOM does not require exact temperatures. They only want to know the longest period in which the temperature was not dropping (i.e. on each successive day it was no smaller than on the day before).  
In fact, the veteran head of BIM knows very well that BOM would like this period as long as possible.  
To whitewash the negligence he insists that Byteasar determines, based on his valuable notes, the longest period in which the temperature could have been not dropping.  
Now this is a task that Byteasar did not quite expect on his BIM internship, and he honestly has no idea how to tackle it.  
He asks you for help in writing a program that determines the longest such period.  
某国进行了连续n天的温度测量，测量存在误差，测量结果是第i天温度在[l_i,r_i]范围内。  
求最长的连续的一段，满足该段内可能温度不降。

连续一段，若后面的下端点大于等于连续段最大的上端点，则还可以继续增加，单调队列维护尺取法。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010000;
const int inf=2147483647;

int n;
int L[maxN],R[maxN];
int Q[maxN];

int main()
{
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d%d",&L[i],&R[i]);
	int Ans=1,p1=1,p2=0;
	for (int l=1,r=1;l<=n;l++)
	{
		while ((r<=n)&&((p1>p2)||(R[r]>=L[Q[p1]])))
		{
			while ((p1<=p2)&&(L[Q[p2]]<=L[r])) p2--;
			Q[++p2]=r;r++;
		}
		Ans=max(Ans,r-l);
		if (Q[p1]==l) p1++;
	}
	printf("%d\n",Ans);
	return 0;
}
```