# [HNOI2002]Kathy函数
[BZOJ1223 Luogu2235]

Tiger非常喜欢数学，所以他参加了学校组织的数学课外兴趣小组。在兴趣小组的学习当中，老师向Tiger介绍了Kathy函数，Kathy函数是这样定义的：
![BZOJ1223](_v_images/_bzoj1223_1537263734_646725670.png)
Tiger对Kathy函数产生了浓厚的兴趣，他通过研究发现有很多的数n都满足 。  
对于一个给定的数m，他希望你求出所有的满足 f(n)=n 的自然数n的个数。

首先证明，f(n) 即是 n 的二进制位反过来的数，设 n 的二进制表示为 [abcde] ， n 反过来为 [edcba] 。证明如下。
首先有对于 n=1,2,3 ，显然满足。  
对于 f(2n)=f(n) ，n=[abcde]，则 2n=[abcde0] ，自然反过来就是 [0edcba] =f(n)，得证。  
对于 f(4n+1)=2f(2n+1)-f(n)，则 4n+1=[abcde01] ，2n+1=[abcde1]，2f(2n+1)=[1edcba]+[1edcba]，则 [10edcba]=[1edcba]+[1edcba]-[edcba]，得证。  
对于 f(4n+3)=3f(2n+1)-2f(n) ，4n+3=[abcde11] ，2n+1=[abcde1]，[11edcba]=[1edcba]+[1edcba]+[1edcba]-[edcba]-[edcba]， 得证。

那么满足 f(n)=n 的数当且仅当 n 的二进制表示为一个回文串，问题转化为求小于等于 n 的二进制回文的数。  
首先考虑长度比 n 的二进制小的，那么现在问题只与长度有关，设 f(i) 表示长度为 i 的回文串个数，不难发现 f(i)=2f(i-2) ，注意到数不能是 0 ，那么就有 f(1)=f(2)=1, f(3)=f(4)=2,f(5)=f(6)=4.... 。可以直接暴力枚举，也可以等比数列求和。  
然后考虑长度刚好与 n 相等的，由于是回文的，所以只要考虑一半。较麻烦的做法是数位 DP ，但是这里由于只有 0/1 两种取值，所以可以简化数位 DP 的过程。考虑最高位 -1 到 mid 的各位，从高到低枚举，如果这一位是 0 ，说明只能放 0 ，否则可以放 0 或 1 ，那么如果在这里放 0 的话后面就随便放了，也就是类似 2^k 的形式，可以用一个变量记录，每次走一位就乘二，如果这一位是 1 则加一。但是这样会漏掉一种可能的情况，就是最后一个 1 的放 1 的放法可能没考虑到。前面的 1 都是考虑到了的，因为它会在后面的 1 取与前面几位 n 相同的方案中去到，但最后一个可能不会。这个方案会出现，当且仅当这一位接 1 能够保证后面存在一种填法使得回文过来之后仍然小于 n 。那么就从中间往两边找对称的，找到第一个不相等的，如果更高位的那个更小，说明存在；否则不存在。  
需要高精度，有较多细节，特别是需要注意奇数回文和偶数回文的区别。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=510;
const int inf=2147483647;

class Bigint
{
public:
	int num[maxN],len;
	Bigint(){
		mem(num,0);len=1;return;
	}

	Bigint(char *s){
		len=strlen(s);for (int i=0;i<len;i++) num[len-i]=s[i]-'0';
		return;
	}
	
	void MainTain(){
		for (int i=1;i<len;i++) num[i+1]+=num[i]/10,num[i]%=10;
		while (num[len]>=10) num[len+1]+=num[len]/10,num[len]%=10,len++;
		return;
	}
	
	Bigint & operator = (int A){
		mem(num,0);num[len=1]=A;MainTain();
		return *this;
	}
	
	Bigint & operator = (Bigint A){
		mem(num,0);
		len=A.len;for (int i=1;i<=len;i++) num[i]=A.num[i];
		return *this;
	}

	Bigint & operator = (char *s){
		mem(num,0);
		len=strlen(s);for (int i=0;i<len;i++) num[len-i]=s[i]-'0';
		return *this;
	}

	int low(){
		return num[1]&1;
	}

	void Right(){
		for (int i=len;i>1;i--) num[i-1]+=(num[i]&1)*10,num[i]>>=1;
		num[1]>>=1;
		while ((num[len]==0)&&(len>1)) len--;
		return;
	}

	void Left(){
		for (int i=1;i<=len;i++) num[i]<<=1;
		MainTain();return;
	}

	void Outp(){
		for (int i=len;i>=1;i--) printf("%d",num[i]);
		printf("\n");
		return;
	}
};

char Input[maxN];
Bigint B;
int bn=0,Bt[maxN*maxN];

Bigint operator + (Bigint A,Bigint B);
Bigint operator + (Bigint A,int B);
Bigint operator - (Bigint A,int B);

int main(){
	scanf("%s",Input);
	B=Input;
	while ((B.num[1])||(B.len>1)){
		Bt[++bn]=B.low();B.Right();
	}
	if (bn<=1){
		printf("%d\n",bn);return 0;
	}

	int mid=(bn+1)>>1;
	Bigint Ans,Tot;Ans=0;Tot=1;
	for (int i=1;i<bn;i++){
		Ans=Ans+Tot;
		if ((i&1)==0) Tot.Left();
	}

	Tot=0;
	for (int i=bn-1;i>=bn-mid+1;i--) Tot.Left(),Tot=Tot+Bt[i];
	bool flag=1;
	for (int i=mid;i>=1;i--)
		if (Bt[i]!=Bt[bn-i+1]){
			flag=Bt[bn-i+1]<Bt[i];break;
		}
	if (flag) Tot=Tot+1;
	Ans=Ans+Tot;

	Ans.Outp();return 0;
}

Bigint operator + (Bigint A,Bigint B){
	Bigint ret;
	ret.len=max(A.len,B.len);
	for (int i=1;i<=ret.len;i++) ret.num[i]=A.num[i]+B.num[i];
	ret.MainTain();return ret;
}

Bigint operator + (Bigint A,int B){
	A.num[1]+=B;A.MainTain();
	return A;
}

Bigint operator - (Bigint A,int B){
	A.num[1]-=B;
	int p=1;
	while (A.num[p]<0) A.num[p]+=10,A.num[p+1]--,p++;
	A.MainTain();return A;
}
```