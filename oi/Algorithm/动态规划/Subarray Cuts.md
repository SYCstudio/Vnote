# Subarray Cuts
[CF513E]

You are given an array of length n and a number k. Let's pick k non-overlapping non-empty subarrays of the initial array. Let si be the sum of the i-th subarray in order from left to right. Compute the maximum value of the following expression:  
|s1 - s2| + |s2 - s3| + ... + |sk - 1 - sk|  
Here subarray is a contiguous part of an array.

对于有绝对值的问题，通常考虑如何把绝对值去掉。  
贪心的想法一定是让很小的和一段很大的交错，这样使得绝对值只差尽量大。那么把较小的称作谷，较大的称作峰，设 F[i][j][0,1,2,3] 表示前 i 个数分成 j 段，第 i 个数属于谷、峰、谷->峰、峰->谷，的最大的差。讨论第 i 个数的所属向后转移。注意需要特判第 1 段和第 m 段只有 1  的贡献，而其它都有 2 的贡献。  
但是最多的情况可能并不是交错地，可能会出现三个或者更多连续上升或下降的段，但是中间的段在一加一减中抵消掉了，那么也就是说为了凑够 m 段，中间可能需要加上一些不会产生贡献的段。同样需要注意这种转移不能出现在首尾。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=30100;
const int maxK=210;
const int inf=147483647;

int n,m;
int A[maxN];
ll F[4][maxN][maxK];

void Max(ll &x,ll y);

int main(){
	scanf("%d%d",&n,&m);
	for (int i=1;i<=n;i++) scanf("%d",&A[i]);
	for (int i=0;i<=n;i++) for (int j=0;j<=m;j++) F[0][i][j]=F[1][i][j]=F[2][i][j]=F[3][i][j]=-inf;
	for (int i=0;i<=n;i++) F[0][i][0]=F[1][i][0]=F[2][i][0]=F[3][i][0]=0;
	for (int i=1;i<=n;i++)
		for (int j=1;j<=min(i,m);j++){
			int k=((j!=1)&&(j!=m));
			F[0][i][j]=max(F[0][i-1][j],F[3][i-1][j-1])-(k+1)*A[i];
			F[1][i][j]=max(F[1][i-1][j],F[2][i-1][j-1])+(k+1)*A[i];
			F[2][i][j]=max(F[2][i-1][j],F[0][i][j]);
			F[3][i][j]=max(F[3][i-1][j],F[1][i][j]);
			if (k){
				F[2][i][j]=max(F[2][i][j],F[2][i-1][j-1]);
				F[3][i][j]=max(F[3][i][j],F[3][i-1][j-1]);
			}
		}

	printf("%lld\n",max(F[2][n][m],F[3][n][m]));

	return 0;
}

void Max(ll &x,ll y){
	x=max(x,y);return;
}
```